class Cannon {
  constructor(xInput, yInput, widthInput, heightInput, angleInput) {
    this.x = xInput;
    this.y = yInput;
    this.width = widthInput;
    this.height = heightInput;
    this.angle = angleInput;
    this.cannon_image = loadImage("assets/canon.png");
    this.cannon_base = loadImage("assets/cannonBase.png");
  }
  display() {
    if (keyIsDown(RIGHT_ARROW) && this.angle < 70 ) {
      this.angle += 1; 
    } else if (keyIsDown(LEFT_ARROW) && this.angle > -30) {
      this.angle -= 1; 
    }
    // displaying the cannon pipe image
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.cannon_image, 0, 0, this.width, this.height);
    pop();

    // displaying the cannon base image
    image(this.cannon_base, 70, 20, 200, 200);
    noFill();
  }
}
