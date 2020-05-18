using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using YetAnotherRetroRegulator.Data;
using YetAnotherRetroRegulator.Types;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YetAnotherRetroRegulator.Controllers
{
	[Route("api/[controller]")]

	public class RetroController : Controller
	{
		public RetroData Retro;
		public RetroController(RetroData retroData)
		{
			Retro = retroData;
		}

		// GET: api/<controller>
		[HttpGet]
		public IEnumerable<string> Get()
		{
			return new string[] { "hello", ",", "world" };
		}

		[Route("areas")]
		[HttpGet]
		public string[] GetAreas()
		{
			return new string[] { "glad", "sad", "idea" };
		}

		[Route("setup")]
		[HttpGet]
		public Dictionary<string, string[]> GetSetup()
		{
			return new Dictionary<string, string[]> { };
		}

		[Route("setup")]
		[HttpPut]
		public ActionResult<RetroSetup> PostSetup([FromBody] RetroSetup value)
		{
			return value;
		}

	}
}
