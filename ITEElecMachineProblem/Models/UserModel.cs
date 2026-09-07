using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITEElecMachineProblem.Models
{
    public class UserModel
    {
        public string EmpID { get; set; }
        public string FName { get; set; }
        public string MName { get; set; }
        public string LName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ContactNumber { get; set; }
        public string Position { get; set; }
        public string Department { get; set; }
    }
}