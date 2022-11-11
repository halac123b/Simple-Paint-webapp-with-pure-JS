class paint {
  constructor(){
    this.color = "#000000"; // màu nét vẽ
    this.tool = "pen"; // hình dạng nét vẽ (circle, rect, line,..)
    this.lineWidth = 1; // Độ dày nét vẽ

    this.canvas = document.getElementById("board");
    this.canvas.width = 1000;
    this.canvas.height = 600;
    this.context = this.canvas.getContext('2d');

    this.previousImage = null; // Ảnh ở trạng thái trc đó để undo
    this.redoImage = null;

    this.currentPos = {
      x: 0,
      y: 0
    }
    // Start pos for special tool
    this.startPos = {
      x: 0,
      y: 0
    }
    this.drawing = false;

    this.listenEvent();
  }

  // Hàm lấy vị trí của mouse
  getMousePos(evt){
    // Get pos của canvas
    var rect = this.canvas.getBoundingClientRect();
    return {
      // evt.clientX / clientY là pos của mouse trên web
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
      // Trừ đi pos của canvas, ta đc pos của mouse trên canvas
    }
  }
  mouseDown(event){
    // Lưu lại ảnh trước khi vẽ để undo
    this.previousImage = new Image();
    this.previousImage.src = this.canvas.toDataURL("image/bmp", 1.0);

    this.startPos = this.getMousePos(event);
    this.drawing = true;
  }
  mouseMove(event){
    let mousePos = this.getMousePos(event);
    if (this.drawing){
      switch(this.tool){
        case "pen":
          this.drawLine(this.currentPos, mousePos);
          break;
        case "line":
          this.undo();
          this.drawLine(this.startPos, this.currentPos);
          break;
        case "rect":
          this.undo();
          this.drawRect(this.startPos, this.currentPos);
      }
      
    }
    this.currentPos = mousePos;
  }
  mouseUp(){
    this.drawing = false;

    this.redoImage = new Image();
    this.redoImage.src = this.canvas.toDataURL("image/bmp", 1.0);
  }
  // Listen sự di chuyển của mouse
  listenEvent(){
    this.canvas.addEventListener("mousedown", (event) => this.mouseDown(event));
    this.canvas.addEventListener("mousemove", (event) => this.mouseMove(event));
    this.canvas.addEventListener("mouseup", (event) => this.mouseUp());
  }
  
  // Vẽ tự do
  drawLine(startPos, endPos){
    this.context.lineWidth = this.lineWidth; // set linewidth
    this.context.strokeStyle = this.color; // set color
    this.context.beginPath();
    this.context.moveTo(startPos.x, startPos.y);
    this.context.lineTo(endPos.x, endPos.y);
    this.context.stroke();
  }
  drawRect(startPos, endPos){
    this.context.lineWidth = this.lineWidth;
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.rect(
      startPos.x,
      startPos.y,
      endPos.x - startPos.x,
      endPos.y - startPos.y
    );
    this.context.stroke();
  }

  changeColor(color){
    this.color = color;
  }
  changeLineWidth(lineWidth){
    this.lineWidth = lineWidth;
  }
  changeTool(tool){
    this.tool = tool;
  }

  undo(){
    this.context.clearRect(0, 0, 1000, 600);
    this.context.drawImage(this.previousImage, 0, 0, 1000, 600);
  }
  redo(){
    this.context.clearRect(0, 0, 1000, 600);
    this.context.drawImage(this.redoImage, 0, 0, 1000, 600);
  }
}

var p = new paint();