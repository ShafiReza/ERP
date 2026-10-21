using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using ScopoERP.API.Models;

namespace ScopoERP.API.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private ApplicationUserManager _userManager;

        public AccountController(
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = new ApplicationUserManager(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);
                       
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [Route("ResetPassword")]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result1 = await UserManager.RemovePasswordAsync(model.UserId);
            if (!result1.Succeeded)
            {
                return GetErrorResult(result1);
            }

            IdentityResult result2 = await UserManager.AddPasswordAsync(model.UserId, model.NewPassword);
            if (!result2.Succeeded)
            {
                return GetErrorResult(result2);
            }

            return Ok();
        }

        [Route("ResetRole")]
        public async Task<IHttpActionResult> ResetRole(ResetRoleBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result1 = await UserManager.RemoveFromRoleAsync(model.UserId, model.PreviousRole);
            if (!result1.Succeeded)
            {
                return GetErrorResult(result1);
            }

            IdentityResult result2 = await UserManager.AddToRoleAsync(model.UserId, model.NewRole);
            if (!result2.Succeeded)
            {
                return GetErrorResult(result2);
            }

            return Ok();
        }

        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = new ApplicationUser()
            {
                FullName = model.FullName,
                UserName = model.UserName,
                CardNo = model.CardNo,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber
            };

            IdentityResult result = await UserManager.CreateAsync(data, model.Password);

            if (!result.Succeeded)
                return GetErrorResult(result);

            var user = await UserManager.Users.Where(x => x.UserName == data.UserName).SingleOrDefaultAsync();

            result = await UserManager.AddToRoleAsync(user.Id, model.Role);

            if (!result.Succeeded)
                return GetErrorResult(result);

            if (!string.IsNullOrEmpty(model.Factories))
            {
                result = await UserManager.AddClaimAsync(user.Id, new Claim("Factories", model.Factories));

                if (!result.Succeeded)
                    return GetErrorResult(result);
            }

            if (!string.IsNullOrEmpty(model.Pages))
            {
                result = await UserManager.AddClaimAsync(user.Id, new Claim("Pages", model.Pages));

                if (!result.Succeeded)
                    return GetErrorResult(result);
            }

            return Ok();
        }

        [Route("GetAllUsers")]
        public IHttpActionResult GetAllUsers()
        {
            var db = new ApplicationDbContext();

            var data = (from u in db.Users
                        join ur in db.Set<IdentityUserRole>() on u.Id equals ur.UserId
                        join r in db.Roles on ur.RoleId equals r.Id
                        orderby r.Name
                        select new
                        {
                            FullName = u.FullName,
                            UserName = u.UserName,
                            CardNo = u.CardNo,
                            Email = u.Email,
                            PhoneNumber = u.PhoneNumber,
                            Roles = r.Name,
                            AccessFailedCount = u.AccessFailedCount,
                            UserId = ur.UserId,
                        }).ToList();

            return Ok(data);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        #endregion
    }
}
