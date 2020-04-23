using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SpaceX
{
    public static class AllUsers
    {
        [FunctionName("AllUsers")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "users")] HttpRequest req,
            [CosmosDB(
                databaseName: "SpaceX",
                collectionName: "Users",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT * from c")]
                JArray users,
            ILogger log)
        {
            log.LogInformation("Get all users...");
            return new OkObjectResult(users);
        }
    }
}
