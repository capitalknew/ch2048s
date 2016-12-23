"use strict";

let kmovemap = [
    [-2, -1],
    [ 2, -1],
    [-2,  1],
    [ 2,  1],
    
    [-1, -2],
    [ 1, -2],
    [-1,  2],
    [ 1,  2]
];

let rdirs = [
    [ 0,  1], //down
    [ 0, -1], //up
    [ 1,  0], //left
    [-1,  0]  //right
];

let bdirs = [
    [ 1,  1],
    [ 1, -1],
    [-1,  1],
    [-1, -1]
];

let padirs = [
    [ 1, -1],
    [-1, -1]
];

let pmdirs = [
    [ 0, -1]
];


let padirsNeg = [
    [ 1, 1],
    [-1, 1]
];

let pmdirsNeg = [
    [ 0, 1]
];


let qdirs = rdirs.concat(bdirs); //may not need

let tcounter = 0;

class Tile {
    constructor(){
        this.field = null;
        this.data = {
            value: 2, 
            piece: 0, 
            loc: [-1, -1], //x, y
            prev: [-1, -1], 
            side: 0 //White = 0, Black = 1
        };
        this.id = tcounter++;
    }
    
    get value(){
        return this.data.value;
    }

    set value(v){
        this.data.value = v;
    }

    get loc(){
        return this.data.loc;
    }

    set loc(v){
        this.data.loc = v;
    }

    attach(field, x, y){
        field.attach(this, x, y);
        return this;
    }
    
    get(relative = [0, 0]){
        if (this.field) return this.field.get([
            this.data.loc[0] + relative[0],
            this.data.loc[1] + relative[1]
        ]);
        return null;
    }
    
    move(lto){
        if (this.field) this.field.move(this.data.loc, lto);
        return this;
    }
    
    put(){
        if (this.field) this.field.put(this.data.loc, this);
        return this;
    }
    
    get loc(){
        return this.data.loc;
    }
    
    set loc(a){
        this.data.loc[0] = a[0];
        this.data.loc[1] = a[1];
    }
    
    cacheLoc(){
        this.data.prev[0] = this.data.loc[0];
        this.data.prev[1] = this.data.loc[1];
        return this;
    }
    
    setField(field){
        this.field = field;
        return this;
    }
    
    setLoc([x, y]){
        this.data.loc[0] = x;
        this.data.loc[1] = y;
        return this;
    }
    
    replaceIfNeeds(){
        if (this.data.piece == 0){
            if (this.data.loc[1] >= this.field.data.height-1 && this.data.side == 1) {
                this.data.piece = this.field.genPiece(true);
            }
            if (this.data.loc[1] <= 0 && this.data.side == 0) {
                this.data.piece = this.field.genPiece(true);
            }
        }
        return this;
    }

    possible(loc){
        if (this.data.piece == 0) { //PAWN
            let list = this.getPawnAttackTiles();
            for (let m of list) {
                if(m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
            }

            list = this.getPawnMoveTiles();
            for (let m of list) {
                if(m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
            }
        } else 

        if (this.data.piece == 1) { //Knight
            let list = this.getKnightPossibleTiles();
            for (let m of list) {
                if(m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
            }
        } else 

        if (this.data.piece == 2) { //Bishop
            for (let d of bdirs){
                if (
                    Math.sign(loc[0] - this.loc[0]) != d[0] || 
                    Math.sign(loc[1] - this.loc[1]) != d[1]
                ) continue;

                let list = this.getDirectionTiles(d);
                for (let m of list.reverse()) {
                    if(m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
                }
            }
        } else 

        if (this.data.piece == 3) { //Rook
            for (let d of rdirs){
                if (
                    Math.sign(loc[0] - this.loc[0]) != d[0] || 
                    Math.sign(loc[1] - this.loc[1]) != d[1]
                ) continue; //Not possible direction

                let list = this.getDirectionTiles(d);
                for (let m of list.reverse()) {
                    if(m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
                }
            }
        } else 

        if (this.data.piece == 4) { //Queen
            for (let d of qdirs){
                if (
                    Math.sign(loc[0] - this.loc[0]) != d[0] || 
                    Math.sign(loc[1] - this.loc[1]) != d[1]
                ) continue; //Not possible direction

                let list = this.getDirectionTiles(d);
                for (let m of list.reverse()) {
                    if(m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
                }
            }
        } else 

        if (this.data.piece == 5) { //King
            for (let d of qdirs){
                if (
                    Math.sign(loc[0] - this.loc[0]) != d[0] || 
                    Math.sign(loc[1] - this.loc[1]) != d[1]
                ) continue; //Not possible direction

                let list = this.getNeightborTiles(d);
                for (let m of list) {
                    if(m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
                }
            }
        }

        return false;
    }

    possible(loc){
        let mloc = this.data.loc;
        let diff = [
            loc[0] - mloc[0],
            loc[1] - mloc[1],
        ];
        let mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));
        let mn = Math.min(Math.abs(diff[0]), Math.abs(diff[1]));
        let dir = [diff[0] / mx, diff[1] / mx];//[Math.sign(diff[0]), Math.sign(diff[1])];
        let tile = this.field.get(loc);

        let trace = ()=>{
            for(let o=1;o<Math.max(diff[0], diff[1])-1;o++){
                let off = [
                    dir[0] * o, 
                    dir[1] * o
                ];
                let cloc = [
                    mloc[0] + off[0], 
                    mloc[1] + off[1]
                ];
                if (
                    this.field.get(cloc).tile && 
                    loc[0] != cloc[0] && 
                    loc[1] != cloc[1]
                ) {
                    return false;
                } 
            }
            return true;
        }

        if (this.data.piece == 0) { //PAWN
            let ydir = this.data.side == 0 ? -1 : 1;
            if (tile.tile) {
                return Math.abs(diff[0]) == 1 && diff[1] == ydir;
            } else {
                return Math.abs(diff[0]) == 0 && diff[1] == ydir;
            }
        } else 

        if (this.data.piece == 1) { //Knight
            if (
                Math.abs(diff[0]) == 1 && Math.abs(diff[1]) == 2 ||
                Math.abs(diff[0]) == 2 && Math.abs(diff[1]) == 1
            ) {
                return true;
            }
        } else 

        if (this.data.piece == 2) { //Bishop
            if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1) {
                return trace();
            }
        } else 

        if (this.data.piece == 3) { //Rook
            if (
                Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0
            ) {
                return trace();
            }
        } else 

        if (this.data.piece == 4) { //Queen
            if (
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0
            ) {
                return trace();
            }
        } else 

        if (this.data.piece == 5) { //King
            if (Math.abs(diff[0]) <= 1 && Math.abs(diff[1]) <= 1) {
                return true;
            }
        }

        return false;
    }

}

export {Tile};
