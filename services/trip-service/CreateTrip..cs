using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace user_service
{
    public static class CreateTrip
    {
        [FunctionName("CreateTrip")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "trips")] HttpRequest req,
            [CosmosDB(
                databaseName: "SpaceX",
                collectionName: "Trips",
                ConnectionStringSetting = "CosmosDBConnection")]
                IAsyncCollector<dynamic> trips,
            ILogger log)
        {
            log.LogInformation("Create trip");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
    
            var trip = new { id = Guid.NewGuid(), userId = data.userId, launchId = data.launchId };
            await trips.AddAsync(trip);

            return new OkObjectResult(trip);
        }
    }
}
