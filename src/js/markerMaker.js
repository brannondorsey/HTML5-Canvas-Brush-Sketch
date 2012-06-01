/*
create a semi-transparent image to be used as a brush tip
*/
function markerMaker(length) {
    this.length = length || 30;
    this.canvas = $('<canvas width="'+length+'px" height="'+length+'px" style="border:1px solid gray;">');
    this.context = this.canvas[0].getContext('2d');
    this.make();
}

markerMaker.prototype.make = function () {
   this.context.fillStyle = "rgba(255,0,0,0.5)";
    this.context.beginPath();

  this.context.moveTo(0,0);
  this.context.quadraticCurveTo(this.length * 0.6, this.length * 0.0, this.length, this.length);
  this.context.moveTo(0,0);
  this.context.quadraticCurveTo(this.length * 0.0, this.length * 0.6, this.length, this.length);
  this.context.closePath();
  var grd = this.context.createLinearGradient(0, 0, this.length, this.length);
        // light blue
        grd.addColorStop(1, "rgba(0,0,0,0.3)");
        // dark blue
        grd.addColorStop(0, "rgba(0,0,0,0.05)");
        this.context.fillStyle = grd;
  
  this.context.fill();



        


}

markerMaker.prototype.getImage = function() {
}


