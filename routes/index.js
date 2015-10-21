
/*
 * GET home page.
 */
var hamilton = require('./hamiltonian_path.js');

var puzzleRow = 12;
var puzzleCol = 9;
var multiple = 0;
var hamiltonPath = [];
var puzzle = new Array(puzzleRow);

exports.index = function (req, res){
    var startNum = 1;
   
    for (var i = 0; i < puzzleRow; i++) {
        puzzle[i] = new Array(puzzleCol);
        for (var j = 0; j < puzzleCol; j++) {
            puzzle[i][j] = 0;
        }
    };
    
    hamiltonPath = hamilton.refresh_path(puzzleCol, puzzleRow);
    multiple = req.param('multiple') || 2;
    
    for (var i = 0; i < hamiltonPath.length; i++) {
        if ((i + 1) % 13 == 0)
            puzzle[hamiltonPath[i][1]][hamiltonPath[i][0]] = "QR";
        else
            puzzle[hamiltonPath[i][1]][hamiltonPath[i][0]] = multiple * startNum++;
    }

    res.render('index', {
        table: puzzle,
        select: multiple
    });
};