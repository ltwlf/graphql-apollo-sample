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
    public static class CreateUser
    {
        [FunctionName("CreateUser")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "users")] HttpRequest req,
            [CosmosDB(
                databaseName: "SpaceX",
                collectionName: "Users",
                ConnectionStringSetting = "CosmosDBConnection")]
                IAsyncCollector<dynamic> users,
            ILogger log)
        {
            log.LogInformation("Create user");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
    
            var user = new { id = Guid.NewGuid(), email = data.email };
            await users.AddAsync(user);

            return new OkObjectResult(user);
        }
    }
}
