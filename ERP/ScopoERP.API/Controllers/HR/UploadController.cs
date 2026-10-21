using ScopoERP.Core.HR.Services;
using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Remoting.Contexts;
using System.Threading.Tasks;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class UploadController : ApiController
    {
        private HRContext context;

        public UploadController(HRContext _context)
        {
            this.context = _context;
        }
        [HttpPost]
        [Route("api/upload")]
        public async Task<HttpResponseMessage> UploadFile()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return Request.CreateResponse(HttpStatusCode.UnsupportedMediaType);
            }

            var root = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadedFiles");
            Directory.CreateDirectory(root);

            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);

                foreach (var file in provider.FileData)
                {
                    var filePath = file.LocalFileName;
                    var originalFileName = file.Headers.ContentDisposition.FileName.Trim('"');

                    // Generate a unique file name
                    var uniqueFileName = $"{Guid.NewGuid()}_{originalFileName}";
                    var finalFilePath = Path.Combine(root, uniqueFileName);
                    File.Move(filePath, finalFilePath);

                    // Map CSV to Database
                    MapCsvToDatabase(finalFilePath);
                }

                return Request.CreateResponse(HttpStatusCode.OK, "File uploaded successfully.");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        private void MapCsvToDatabase(string filePath)
        {
            List<AttendanceViewModel> list = new List<AttendanceViewModel>();
            var lines = File.ReadAllLines(filePath);

            // Skip the first line (headers) by starting the loop from index 1
            for (int i = 1; i < lines.Length; i++)
            {
                var line = lines[i];
                var columns = line.Split(',');

                var attendance = new Attendance
                {
                    CardNo = columns[1].Trim('"'),
                    InOutTime = Convert.ToDateTime(columns[2].Trim('"')),
                    IsDeleted = false,
                    LastModified = DateTime.Now,
                    Remarks = "CSV Upload"
                };

                context.Attendances.Add(attendance);
            }

            context.SaveChanges();
        }
    }
}
