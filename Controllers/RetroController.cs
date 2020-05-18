using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using YetAnotherRetroRegulator.Data;
using YetAnotherRetroRegulator.Types;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YetAnotherRetroRegulator.Controllers
{
  [Route("api/[controller]")]

  public class RetroController : Controller
  {
    private RetroData Retro;
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

    [Route("lastupdate")]
    [HttpGet]
    public DateTime GetLastPublished()
    {
      return Retro.LastPublished;
    }

    [Route("setup")]
    [HttpGet]
    public RetroSetup GetSetup()
    {
      return new RetroSetup() { Areas = Retro.Areas, Votes = Retro.AvailableVotes };
    }

    [Route("setup")]
    [HttpPut]
    public ActionResult<RetroSetup> PutSetup([FromBody] RetroSetup value)
    {
      Retro.Areas = value.Areas;
      Retro.AvailableVotes = value.Votes;
      return value;
    }

    [Route("publish")]
    [HttpPost]
    public ActionResult<RetroItem> PublishItem([FromBody] RetroItem value)
    {
      Retro.Items.Add(value);
      Retro.LastPublished = DateTime.Now;
      return value;
    }

    [Route("items")]
    [HttpGet]
    public Update GetItems()
    {
      return new Update(Retro.LastPublished, Retro.Items.ToArray());
    }
  }
}
