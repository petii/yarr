using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
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
      value.Id = Retro.Items.Count;
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

    [Route("items")]
    [HttpPatch]
    public GroupType SetGroup([FromBody] RetroItem data)
    {
      if (data.Group != null && data.Group.Id == null)
      {
        data.Group.Id = Retro.Groups.Count + 1;
        Retro.Groups.Add(data.Group);
      }
      else if (data.Group != null)
      {
        Retro.Groups.Find(item => item.Id == data.Group.Id).Name = data.Group.Name;
      }
      Retro.Items.Find(item => item.Id == data.Id).Group = data.Group;
      Retro.LastPublished = DateTime.Now;
      return data.Group;
    }

    [Route("vote")]
    [HttpPost]
    public int[] Vote([FromBody] int[] votes)
    {
      Retro.Votes.AddRange(votes);
      Retro.LastPublished = DateTime.Now;
      return votes;
    }

    [Route("votes")]
    [HttpGet]
    public VoteUpdate GetVotes()
    {
      var data = new VoteUpdate();
      data.Timestamp = Retro.LastPublished;
      data.Votes = Retro.Votes.ToArray();
      return data;
    }
  }
}
