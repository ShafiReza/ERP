using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.ProductionStatus.BLL
{
    public class StyleOperationLogic
    {
        private UnitOfWork unitOfWork;
        

        public StyleOperationLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateStyleOperation(List<StyleOperationViewModel> operationList)
        {
            int styleId = operationList[0].StyleID;
            string floor = operationList[0].Floor;
            string line = operationList[0].Line;
            string topOrBottom = operationList[0].TopOrBottom;

            var existingData = new List<StyleOperations>();

            if (topOrBottom != null)
            {
                existingData = unitOfWork.StyleOperationRepository.Get().Where(x => x.StyleID == styleId && x.Floor == floor && x.Line == line && x.TopOrBottom == topOrBottom).ToList();
            }
            else
            {
                existingData = unitOfWork.StyleOperationRepository.Get().Where(x => x.StyleID == styleId && x.Floor == floor && x.Line == line).ToList();
            }
            unitOfWork.StyleOperationRepository.DeleteRange(existingData);



            foreach (var operation in operationList)
            {
               var styleOperation = new StyleOperations
                {
                    StyleID = operation.StyleID,
                    Floor = operation.Floor,
                    Line = operation.Line,
                    sam = operation.Sam,
                    OperationID = operation.OperationID,
                    SpecID = operation.SpecID,
                    Caption = operation.Caption,
                    Sequence = operation.Sequence,
                    AuxSam = operation.AuxSam,
                    MachineID = operation.MachineID,
                    SectionNo = operation.SectionNo,
                    SupervisorID = operation.SupervisorID,
                    StyleOperationName = operation.StyleOperationName,
                    Size = operation.Size,
                    NoOfWS= operation.NoOfWS,
                    TopOrBottom = GetKnitCriteria(operation.TopOrBottom)
               };
                unitOfWork.StyleOperationRepository.Insert(styleOperation);

            }
            unitOfWork.Save();
        }
        
        public List<StyleOperationViewModel> GetStyleOperationListByStyleID(int styleId, string floor, string line, string topOrBottom)
        {
           

            var operationList = (from s in unitOfWork.StyleOperationRepository.Get()
                                 join st in unitOfWork.StyleRepository.Get() on s.StyleID equals st.StyleId
                                 join i in unitOfWork.ItemCategoryRepository.Get() on s.MachineID equals i.ItemCategoryId
                                 join o in unitOfWork.StandardOperationRepository.Get() on s.OperationID equals o.OperationID
                                 where s.StyleID == styleId && s.Floor== floor && s.Line == line
                                 select new StyleOperationViewModel
                                 {
                                     StyleID = s.StyleID,
                                     Floor = s.Floor,   
                                     StyleNo = st.StyleNo,
                                     Sam = s.sam,
                                     AuxSam = s.AuxSam,
                                     OperationID = s.OperationID,
                                     OperationName = o.OperationName,
                                     SpecID = s.SpecID,
                                     Caption=s.Caption,
                                     Sequence=s.Sequence,
                                    
                                     MachineID = s.MachineID,
                                     MachineName = i.Name,
                                     SectionNo = s.SectionNo,
                                     SupervisorID = s.SupervisorID,
                                     StyleOperationName = s.StyleOperationName,
                                     NoOfWS= s.NoOfWS,
                                     TopOrBottom= s.TopOrBottom,
                                 });

            if(topOrBottom != null)
                operationList = operationList.Where(x=>x.TopOrBottom==topOrBottom);
            
            return operationList.OrderBy(x => x.Sequence).ToList();
        }

        public string GetKnitCriteria(string topOrBottom)
        {
            string result = String.Empty;
            if (Enum.TryParse<KnitCriteria>(topOrBottom, true, out KnitCriteria knitCriteria))
            {
                switch (knitCriteria)
                {
                    case KnitCriteria.Top:
                        result = "Top";
                        break;
                    case KnitCriteria.Bottom:
                        result = "Bottom";
                        break;
                    default:
                        break;
                }
            }
            else
            {
                result = null;
            }

            return result;
        }
    }
}
