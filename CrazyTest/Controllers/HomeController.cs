using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CrazyTest.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Entry(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public JsonResult GetCustomers()
        {
            using (TestDBEntities dc = new TestDBEntities())
            {
                var data = dc.Customers.OrderBy(a => a.Name).ToList();
                return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        public JsonResult GetCustomerById(string Id)
        {
            using (TestDBEntities dc = new TestDBEntities())
            {
                Customer cust = new Customer();
                if (Id != null)
                {
                    var id = int.Parse(Id);
                    cust = dc.Customers.Where(a => a.Id == id).FirstOrDefault();
                }                   
                    
                return new JsonResult { Data = cust, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpPost]
        public JsonResult SaveCustomerData(Customer customer)
        {
            bool status = false;
            string message = "";
            if (ModelState.IsValid)
            {
                using (TestDBEntities dc = new TestDBEntities())
                {
                    var query = dc.Customers.Where(a => a.Id == customer.Id).FirstOrDefault();
                    if (query == null)
                    {
                        customer.CreateDate = DateTime.Now;
                        dc.Customers.Add(customer);
                    }
                    else
                    {
                        query.Name = customer.Name;
                        query.Email = customer.Email;
                        query.Country = customer.Country;
                        query.ZipCode = customer.ZipCode;
                    }
                    dc.SaveChanges();
                    status = true;
                    message = "Save Complete";
                }
            }
            else
            {
                message = "Failed! Please try again";
            }
            return new JsonResult { Data = new { status = status, message = message } };
        }

        [HttpPost]
        public JsonResult DeleteCustomer(Customer customer)
        {
            bool status = false;
            string message = "";
            if (ModelState.IsValid)
            {
                using (TestDBEntities dc = new TestDBEntities())
                {
                    var query = dc.Customers.Where(a => a.Id == customer.Id).FirstOrDefault();
                    if (query != null)
                    {
                        dc.Customers.Remove(query);
                    }

                    dc.SaveChanges();
                    status = true;
                    message = "Deleted Complete";
                }
            }
            else
            {
                message = "Failed! Please try again";
            }
            return new JsonResult { Data = new { status = status, message = message } };
        }
    }
}