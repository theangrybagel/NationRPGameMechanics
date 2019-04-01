var countries = [];
var ResourceIndex = ["Resource 1", "Resource 2", "Resource 3", "Resource 4"];
var addedCountry = document.getElementById("CountryTemplate").innerHTML;
Assign("CountryTemplate", '<b><p id="stuff"></p></b>');
var cTile = null;
var sections = [];
var csx = 0;
var csy = 0;
//setTimeout(function(){Grid.pixelateCanvas();}, 2005);
//Grid.pixelateCanvas();

function OnClear() {
  SetBackground("Map.png");
}
var SelectedCountry = null;
function SelectCountry(id) {
  if (SelectedCountry != null) {
    console.log(SelectedCountry);
    console.log(id);
    GetE(SelectedCountry.id + "CName").style = "color: red";
  }
  SelectedCountry = countries[id - 1];
  GetE(id + "CName").style = "color: blue";
}
function AddCountry() {
  var c = new Country(countries.length);
  console.log(c.id);
  c.name = document.getElementById("countryAdd").value;
  GetE("Countries").innerHTML += addedCountry;
  var txt = addedCountry + "";
  Assign("CName", c.name + "");
  SetId("CName");
  GetE(countries.length + "CName").setAttribute(
    "onClick",
    "SelectCountry(" + countries.length + ");"
  );
  SetId("slider");
  SetId("troops");
  SetId("r1");
  SetId("r2");
  SetId("r3");
  SetId("r4");
  GetE("CCT").setAttribute(
    "onClick",
    "CreateTroops(" + countries.length + ");"
  );
  SetId("CCT");
}
function OnMouseExitTile(tile) {
  tile.highlightObj.enabled = false;
}
function OnMouseEnterTile(tile) {
  console.log("enter");
  var c = tile.getAverageColor();
  cTile = tile;
  cTile.highlightObj.enabled = true;
  GetE("stuff").innerHTML =
    "Average color of current tile (" + tile.x + ", " + tile.y + "): " + c;
  GetE("stuff").setAttribute("style", "fontsize: 32; color: " + c + ";");
}
function VisualizeSections(filter) {
  if (filter == "water") {
    for (i = 0; i < sections.length; i++) {
      for (ii = 0; ii < sections[i].length; i++) {
        if (sections[i][ii].shore) {
          new Object(i, ii, "yellow");
        }
      }
    }
  }
}
function OnMouseClicked() {
  //get the current tile and allow the user to edit it
  EditSection();
}
function OnKeyDown(kc) {
  VisualizeSections("water");
  if (kc == "q") {
    currentSection.modify("ocean");
  }
  if (kc == "e") {
    currentSection.modify("shore");
  }
}
function OnDirectionDown(dx, dy) {
  cTile.highlightObj.enabled = false;
  cTile = Tiles[dx + csx][dy + csy];
  cTile.highlightObj.enabled = true;
  EditSection();
}
function GetE(id) {
  return document.getElementById(id);
}

function SetId(id) {
  var newID = countries.length + document.getElementById(id).id;
  document.getElementById(id).id = newID;
}
function Set(id, idName, txt) {
  document.getElementById(id + 1 + idName).innerHTML = txt;
}
function Assign(id, txt) {
  document.getElementById(id).innerHTML = txt;
}
setInterval(UUpdate, 10);

function UUpdate() {
  for (i = 0; i < countries.length; i++) {
    var c = countries[i];
    Set(i, "r1", ResourceIndex[0] + ": " + c.resource_0);
    Set(i, "r2", ResourceIndex[1] + ": " + c.resource_1);
    Set(i, "r3", ResourceIndex[2] + ": " + c.resource_2);
    Set(i, "r4", ResourceIndex[3] + ": " + c.resource_3);
    document.getElementById(i + 1 + "troops").innerHTML = "Troops: " + c.troops;
    Assign(
      i + 1 + "CCT",
      "Add Troops (" + document.getElementById(i + 1 + "slider").value + ")"
    );
  }
}

function Country(id) {
  countries.push(this);
  this.name = "";
  this.id = id;
  this.population = 1;
  this.troops = 10;
  this.resource_0 = 50;
  this.resource_1 = 50;
  this.resource_2 = 20;
  this.resource_3 = 15;
}
function Section() {
  //represents an area on the map
  this.x = 0;
  this.y = 0;
  this.obj = new Object(0, 0);
  this.obj.fillTiles = false;
  this.population = 0;
  this.economicStatus = 0;
  this.shore = false;
  this.river = 0;
  this.forest = 0;
  this.mountain = 0;
  this.ocean = true;
  this.border = false;
  this.update = function() {
    this.obj.x = this.x;
    this.obj.y = this.y;
  };
}
//GenerateSections();
function GenerateSections() {
  for (i = 0; i < 25; i++) {
    sections.push([]);
    for (ii = 0; ii < 25; ii++) {
      var n = new Section();
      n.x = i;
      n.y = ii;
      n.obj.color =
        "rgb(" + RandomInt(30, 75) + "," + RandomInt(50, 80) + ", 100)";
      n.update();
      sections[i].push(n);
    }
  }
}
function CreateTroops(c) {
  var country = countries[c - 1];
  var amt = GetE(c + "slider").value;
  if (amt > country.troops) amt = country.troops;
  country.troops -= amt;
  for (i = 0; i < amt; i++) {
    var spot = Grid.GetRandomEmptyTile();
    new Soldier(spot.x, spot.y);
  }
}
function EditSection() {
  csx = cTile.x;
  csy = cTile.y;
  document.getElementById("currentlyEditing").innerHTML =
    "Editing tile " + cTile.x + ", " + cTile.y;
  currentSection.sctn = cTile;
  ApplyStatus(currentSection.sctn);
}
var currentSection = new cs();
function cs() {
  this.sctn = null;
  this.modify = function(modifiedValue) {
    if (modifiedValue == "ocean") this.sctn.ocean = !this.sctn.ocean;
    if (modifiedValue == "shore") this.sctn.shore = !this.sctn.shore;

    ApplyStatus(this.sctn);
  };
}
function ApplyStatus(section) {
  GetE("currentStatus").innerHTML =
    "(a) Ocean: " + section.ocean + "<br>" + "Shore: " + section.shore;
}
function Soldier(x, y) {
  this.x = x;
  this.y = y;
  this.obj = new Object(this.x, this.y);
  this.class = new Class();
}

function Class() {
  this.level = 1;
  this.hp = 50;
  this.defense = 1;
  this.offense = 1;
}
