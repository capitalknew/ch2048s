"use strict";

let iconset = [
    "./assets/whitePawn.svg",
    "./assets/whiteKnight.svg",
    "./assets/whiteBishop.svg",
    "./assets/whiteRook.svg",
    "./assets/whiteQueen.svg",
    "./assets/whiteKing.svg"
];

let iconsetBlack = [
    "./assets/blackPawn.svg",
    "./assets/blackKnight.svg",
    "./assets/blackBishop.svg",
    "./assets/blackRook.svg",
    "./assets/blackQueen.svg",
    "./assets/blackKing.svg"
];

Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype;
    elproto.toFront = function () {
        this.prependTo(this.paper);
    };
    elproto.toBack = function () {
        this.appendTo(this.paper);
    };
});

class GraphicsEngine {
    
    constructor(svgname = "#svg"){
        this.manager = null;
        this.field = null;
        this.input = null;

        this.graphicsLayers = [];
        this.graphicsTiles = [];
        this.visualization = [];
        this.snap = Snap(svgname);
        this.svgel = document.querySelector(svgname);
        this.scene = null;

        this.scoreboard = document.querySelector("#score");

        this.params = {
            border: 4,
            decorationWidth: 10, 
            grid: {
                width: parseFloat(this.svgel.clientWidth), 
                height: parseFloat(this.svgel.clientHeight)
            },
            tile: {
                //width: 128, 
                //height: 128, 
                styles: [
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.data.bonus == 1;
                        }, 
                        fill: "rgb(192, 192, 192)",
                        font: "rgb(0, 0, 0)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value < 1;
                        }, 
                        fill: "rgb(32, 32, 32)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 1 && tile.value < 2;
                        }, 
                        fill: "rgb(255, 224, 128)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 2 && tile.value < 4;
                        }, 
                        fill: "rgb(255, 192, 128)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 4 && tile.value < 8;
                        }, 
                        fill: "rgb(224, 128, 96)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 8 && tile.value < 16;
                        }, 
                        fill: "rgb(224, 96, 64)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 16 && tile.value < 32;
                        }, 
                        fill: "rgb(224, 64, 64)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 32 && tile.value < 64;
                        }, 
                        fill: "rgb(224, 64, 0)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 64 && tile.value < 128;
                        }, 
                        fill: "rgb(224, 0, 0)", 
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 128 && tile.value < 256;
                        }, 
                        fill: "rgb(224, 128, 0)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 256 && tile.value < 512;
                        }, 
                        fill: "rgb(224, 192, 0)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 512 && tile.value < 1024;
                        }, 
                        fill: "rgb(224, 224, 0)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 1024 && tile.value < 2048;
                        }, 
                        fill: "rgb(255, 224, 0)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 2048;
                        }, 
                        fill: "rgb(255, 230, 0)"
                    }

                ]
            }
        };
    }

    createSemiVisible(loc){
        let object = {
            loc: loc
        };
        
        let params = this.params;
        let pos = this.calculateGraphicsPosition(loc);

        let s = this.graphicsLayers[2].object;
        let radius = 5;
        let w = params.tile.width; 
        let h = params.tile.height;

        let rect = s.rect(
            0, 
            0, 
            w, 
            h, 
            radius, radius
        );

        let group = s.group(rect);
        group.transform(`translate(${pos[0]}, ${pos[1]})`);

        rect.attr({
            fill: "transparent"
        });

        object.element = group;
        object.rectangle = rect;
        object.area = rect;
        object.remove = () => {
            this.graphicsTiles.splice(this.graphicsTiles.indexOf(object), 1);
        };
        return object;
    }
    
    createDecoration(){
        let w = this.field.data.width;
        let h = this.field.data.height;
        let b = this.params.border;
        let tw = (this.params.tile.width  + b) * w + b;
        let th = (this.params.tile.height + b) * h + b;
        this.params.grid.width = tw;
        this.params.grid.height = th;
        
        let decorationLayer = this.graphicsLayers[0];
        {
            let rect = decorationLayer.object.rect(0, 0, tw, th, 0, 0);
            rect.attr({
                fill: "rgb(240, 224, 192)"
            });
        }

        let width = this.manager.field.data.width;
        let height = this.manager.field.data.height;

        //Decorative chess field
        this.chessfield = [];
        for(let y=0;y<height;y++){
            this.chessfield[y] = [];
            for (let x=0;x<width;x++){
                let params = this.params;
                let pos = this.calculateGraphicsPosition([x, y]);
                let border = 0;//this.params.border;

                let s = this.graphicsLayers[0].object;
                let f = s.group();
                
                let radius = 5;
                let rect = f.rect(
                    0, 
                    0, 
                    params.tile.width + border, 
                    params.tile.height + border,
                    radius, radius
                );
                rect.attr({
                    "fill": x % 2 != y % 2 ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                });
                f.transform(`translate(${pos[0]-border/2}, ${pos[1]-border/2})`);
                

            }
        }

        {
            let rect = decorationLayer.object.rect(
                -this.params.decorationWidth/2, 
                -this.params.decorationWidth/2, 
                tw + this.params.decorationWidth,
                th + this.params.decorationWidth, 
                5, 
                5
                );
            rect.attr({
                fill: "transparent",
                stroke: "rgb(128, 64, 32)",
                "stroke-width": this.params.decorationWidth
            });
        }
    }

    createComposition(){
        this.graphicsLayers.splice(0, this.graphicsLayers.length);
        let scene = this.snap.group();
        scene.transform(`translate(${this.params.decorationWidth}, ${this.params.decorationWidth})`);

        this.scene = scene;
        this.graphicsLayers[0] = { //Decoration
            object: scene.group()
        };
        this.graphicsLayers[1] = {
            object: scene.group()
        };
        this.graphicsLayers[2] = {
            object: scene.group()
        };
        this.graphicsLayers[3] = {
            object: scene.group()
        };
        this.graphicsLayers[4] = {
            object: scene.group()
        };
        this.graphicsLayers[5] = {
            object: scene.group()
        };

        let width = this.manager.field.data.width;
        let height = this.manager.field.data.height;

        this.params.tile.width  = (this.params.grid.width  - this.params.border * (width + 1)  - this.params.decorationWidth*2) / width;
        this.params.tile.height = (this.params.grid.height - this.params.border * (height + 1) - this.params.decorationWidth*2) / height;


        for(let y=0;y<height;y++){
            this.visualization[y] = [];
            for (let x=0;x<width;x++){
                this.visualization[y][x] = this.createSemiVisible([x, y]);
            }
        }

        this.receiveTiles();
        this.createDecoration();
        this.createGameOver();
        this.createVictory();
        return this;
    }
    

    createGameOver(){
        let screen = this.graphicsLayers[4].object;
        
        let w = this.field.data.width;
        let h = this.field.data.height;
        let b = this.params.border;
        let tw = (this.params.tile.width + b) * w + b;
        let th = (this.params.tile.height + b) * h + b;

        let bg = screen.rect(0, 0, tw, th, 5, 5);
        bg.attr({
            "fill": "rgba(255, 224, 224, 0.8)"
        });
        let got = screen.text(tw / 2, th / 2 - 30, "Game Over");
        got.attr({
            "font-size": "30",
            "text-anchor": "middle", 
            "font-family": "Comic Sans MS"
        })







        {
            let buttonGroup = screen.group();
            buttonGroup.transform(`translate(${tw / 2 + 5}, ${th / 2 + 20})`);
            buttonGroup.click(()=>{
                this.manager.restart();
                this.hideGameover();
            });

            let button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(224, 192, 192, 0.8)"
            });

            let buttonText = buttonGroup.text(50, 20, "New game");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle", 
                "font-family": "Comic Sans MS"
            });
        }

        {
            let buttonGroup = screen.group();
            buttonGroup.transform(`translate(${tw / 2 - 105}, ${th / 2 + 20})`);
            buttonGroup.click(()=>{
                this.manager.restoreState();
                this.hideGameover();
            });

            let button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(224, 192, 192, 0.8)"
            });

            let buttonText = buttonGroup.text(50, 20, "Undo");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle", 
                "font-family": "Comic Sans MS"
            });
        }

        this.gameoverscreen = screen;
        screen.attr({"visibility": "hidden"});

        return this;
    }



    createVictory(){
        let screen = this.graphicsLayers[5].object;
        
        let w = this.field.data.width;
        let h = this.field.data.height;
        let b = this.params.border;
        let tw = (this.params.tile.width + b) * w + b;
        let th = (this.params.tile.height + b) * h + b;

        let bg = screen.rect(0, 0, tw, th, 5, 5);
        bg.attr({
            "fill": "rgba(224, 224, 256, 0.8)"
        });
        let got = screen.text(tw / 2, th / 2 - 30, "You won! You got " + this.manager.data.conditionValue + "!");
        got.attr({
            "font-size": "30",
            "text-anchor": "middle", 
            "font-family": "Comic Sans MS"
        })

        {
            let buttonGroup = screen.group();
            buttonGroup.transform(`translate(${tw / 2 + 5}, ${th / 2 + 20})`);
            buttonGroup.click(()=>{
                this.manager.restart();
                this.hideVictory();
            });

            let button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(128, 128, 255, 0.8)"
            });

            let buttonText = buttonGroup.text(50, 20, "New game");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle", 
                "font-family": "Comic Sans MS"
            });
        }

        {
            let buttonGroup = screen.group();
            buttonGroup.transform(`translate(${tw / 2 - 105}, ${th / 2 + 20})`);
            buttonGroup.click(()=>{
                this.hideVictory();
            });

            let button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(128, 128, 255, 0.8)"
            });

            let buttonText = buttonGroup.text(50, 20, "Continue...");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle", 
                "font-family": "Comic Sans MS"
            });
        }

        this.victoryscreen = screen;
        screen.attr({"visibility": "hidden"});

        return this;
    }

    showVictory(){
        this.victoryscreen.attr({"visibility": "visible"});
        this.victoryscreen.attr({
            "opacity": "0"
        });
        this.victoryscreen.animate({
            "opacity": "1"
        }, 1000, mina.easein, ()=>{

        });

        return this;
    }

    hideVictory(){
        this.victoryscreen.attr({
            "opacity": "1"
        });
        this.victoryscreen.animate({
            "opacity": "0"
        }, 500, mina.easein, ()=>{
            this.victoryscreen.attr({"visibility": "hidden"});
        });
        return this;
    }

    showGameover(){
        this.gameoverscreen.attr({"visibility": "visible"});
        this.gameoverscreen.attr({
            "opacity": "0"
        });
        this.gameoverscreen.animate({
            "opacity": "1"
        }, 1000, mina.easein, ()=>{

        });
        return this;
    }

    hideGameover(){
        this.gameoverscreen.attr({
            "opacity": "1"
        });
        this.gameoverscreen.animate({
            "opacity": "0"
        }, 500, mina.easein, ()=>{
            this.gameoverscreen.attr({"visibility": "hidden"});
        });
        return this;
    }

    selectObject(tile){
        for(let i=0;i<this.graphicsTiles.length;i++){
            if(this.graphicsTiles[i].tile == tile) return this.graphicsTiles[i];
        }
        return null;
    }
    
    changeStyleObject(obj, needup = false){
        let tile = obj.tile;
        let pos = this.calculateGraphicsPosition(tile.loc);
        let group = obj.element;
        //group.transform(`translate(${pos[0]}, ${pos[1]})`);

        if (needup) group.toFront();
        group.animate({
            "transform": `translate(${pos[0]}, ${pos[1]})`
        }, 80, mina.easein, ()=>{
            
        });
        obj.pos = pos;

        let style = null;
        for(let _style of this.params.tile.styles) {
            if(_style.condition.call(obj.tile)) {
                style = _style;
                break;
            }
        }

        obj.text.attr({"text": `${tile.value}`});
        obj.icon.attr({"xlink:href": obj.tile.data.side == 0 ? iconset[obj.tile.data.piece] : iconsetBlack[obj.tile.data.piece]});
        obj.text.attr({
            "font-size": this.params.tile.width * 0.15, //"16px",
            "text-anchor": "middle", 
            "font-family": "Comic Sans MS", 
            "color": "black"
        });
        
        if (!style) return this;
        obj.rectangle.attr({
            fill: style.fill
        });
        if (style.font) {
            obj.text.attr("fill", style.font);
        } else {
            obj.text.attr("fill", "black");
        }

        return this;
    }

    changeStyle(tile){
        let obj = this.selectObject(tile);
        this.changeStyleObject(obj);
        return this;
    }

    removeObject(tile){
        let object = this.selectObject(tile);
        if (object) object.remove();
        return this;
    }

    showMoved(tile){
        this.changeStyle(tile, true);
        return this;
    }
    
    calculateGraphicsPosition([x, y]){
        let params = this.params;
        let border = this.params.border;
        return [
            border + (params.tile.width  + border) * x,
            border + (params.tile.height + border) * y
        ];
    }

    selectVisualizer(loc){
        if (
            !loc || 
            !(loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.field.data.width && loc[1] < this.field.data.height)
        ) return null;
        return this.visualization[loc[1]][loc[0]];
    }

    createObject(tile){
        if (this.selectObject(tile)) return null;

        let object = {
            tile: tile
        };

        let params = this.params;
        let pos = this.calculateGraphicsPosition(tile.loc);

        let s = this.graphicsLayers[1].object;
        let radius = 5;

        let w = params.tile.width;
        let h = params.tile.height;

        let rect = s.rect(
            0, 
            0, 
            w,
            h, 
            radius, radius
        );

        let fillsizew = params.tile.width  * (0.5 - 0.125);
        let fillsizeh = fillsizew;//params.tile.height * (1.0 - 0.2);

        let icon = s.image(
            "", 
            fillsizew, 
            fillsizeh, 
            w  - fillsizew * 2, 
            h - fillsizeh * 2
        );

        let text = s.text(w / 2, h / 2 + h * 0.35, "TEST");
        let group = s.group(rect, icon, text);
        
        group.transform(`
            translate(${pos[0]}, ${pos[1]}) 
            translate(${w/2}, ${h/2}) 
            scale(0.01, 0.01) 
            translate(${-w/2}, ${-h/2})
        `);
        group.attr({"opacity": "0"});

        group.animate({
            "transform": 
            `
            translate(${pos[0]}, ${pos[1]}) 
            translate(${w/2}, ${h/2}) 
            scale(1.0, 1.0) 
            translate(${-w/2}, ${-h/2})
            `,
            "opacity": "1"
        }, 80, mina.easein, ()=>{

        });

        object.pos = pos;
        object.element = group;
        object.rectangle = rect;
        object.icon = icon;
        object.text = text;
        object.remove = () => {
            this.graphicsTiles.splice(this.graphicsTiles.indexOf(object), 1);

            group.animate({
                "transform": 
                `
                translate(${object.pos[0]}, ${object.pos[1]}) 
                translate(${w/2}, ${h/2}) 
                scale(0.01, 0.01) 
                translate(${-w/2}, ${-h/2})
                `,
                "opacity": "0"
            }, 80, mina.easein, ()=>{
                object.element.remove();
            });

        };

        this.changeStyleObject(object);
        return object;
    }
    
    getInteractionLayer(){
        return this.graphicsLayers[3];
    }

    clearShowed(){
        let width = this.manager.field.data.width;
        let height = this.manager.field.data.height;
        for (let y=0;y<height;y++){
            for (let x=0;x<width;x++){
                let vis = this.selectVisualizer([x, y]);
                vis.area.attr({fill: "transparent"});
            }
        }
        return this;
    }

    showSelected(){
        if (!this.input.selected) return this;
        let tile = this.input.selected.tile;
        if (!tile) return this;
        let object = this.selectVisualizer(tile.loc);
        if (object){
            object.area.attr({"fill": "rgba(255, 0, 0, 0.2)"});
        }
        return this;
    }

    showPossible(tileinfolist){
        if (!this.input.selected) return this;
        for(let tileinfo of tileinfolist){
            let tile = tileinfo.tile;
            let object = this.selectVisualizer(tileinfo.loc);
            if(object){
                object.area.attr({"fill": "rgba(0, 255, 0, 0.2)"});
            }
        }
        return this;
    }

    receiveTiles(){
        this.clearTiles();
        let tiles = this.manager.tiles;
        for(let tile of tiles){
            if (!this.selectObject(tile)) {
                this.graphicsTiles.push(this.createObject(tile));
            }
        }
        return this;
    }
    
    clearTiles(){
        for (let tile of this.graphicsTiles){
            if (tile) tile.remove();
        }
        return this;
    }
    
    pushTile(tile){
        if (!this.selectObject(tile)) {
            this.graphicsTiles.push(this.createObject(tile));
        }
        return this;
    }

    updateScore(){
        this.scoreboard.innerHTML = this.manager.data.score;
    }
    
    attachManager(manager){
        this.field = manager.field;
        this.manager = manager;
        
        this.field.ontileremove.push((tile)=>{ //when tile removed
            this.removeObject(tile);
        });
        this.field.ontilemove.push((tile)=>{ //when tile moved
            this.changeStyle(tile);
        });
        this.field.ontileadd.push((tile)=>{ //when tile added
            this.pushTile(tile);
        });
        this.field.ontileabsorption.push((old, tile)=>{
            this.updateScore();
        });

        return this;
    }
    
    attachInput(input){ //May required for send objects and mouse events
        this.input = input;
        input.attachGraphics(this);
        return this;
    }
    
}

export {GraphicsEngine};
