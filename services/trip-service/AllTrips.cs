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
    public static class AllTrips
    {
        [FunctionName("AllTrips")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "trips")] HttpRequest req,
            [CosmosDB(
                databaseName: "SpaceX",
                collectionName: "Trips",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT * from c")]
                JArray users,
            ILogger log)
        {
            log.LogInformation("Get all trips...");
            return new OkObjectResult(users);
        }
    }
}
