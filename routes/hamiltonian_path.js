//Implementation of Hamiltonian Path algorithm due to 
//Nathan Clisby, July 2012.

//Comments about the Markov chain used to generate paths
//* using backbiting move described in Secondary structures in long
//compact polymers, PHYSICAL REVIEW E 74, 051801 ͑2006, by Richard
//Oberdorf, Allison Ferguson, Jesper L. Jacobsen and Jan\'e Kondev
//* algorithm is believed to be ergodic, but this has not been proved.
//* current implementation is not the most efficient possible, O(N) for N
//step walks, which could be improved with more sophisticated data
//structure
//* heuristic used for decision that equilibrium distribution is being
//sampled from. This heuristic is quite conservative, but not certain.
//* currently using default random number generator. This should be `good
//enough' for generating typical walks, but shouldn't be replied upon for
//serious numerical work.

//Adapted to arbitrarily shaped sublattices - just have an 'accept' function
//Simplified reversal procedure - just go through each step (O(N) to reverse, anyway)
//Different initialisation - start from a single point, incrementally add.
//Simplified checking of neighbours.

var path = [];
var xmax = 20;
var ymax = 20;
var n = (xmax+1)*(ymax+1);
var left_end = true;
var must_fill = true;
var draw_arrow = false;

//var xmax = 21;
//var ymax = 41;
//[>var xmax = 5;<]
//[>var ymax = 5;<]
//function inSublattice(x, y)
//{
    //if (x<0) return false;
    //if (x>xmax) return false;
    //if (y<0) return false;
    //if (y>ymax) return false;
    //if ((x>1) && (x<20) && (y>5) && (y<12)) return false;
    //if ((x>3) && (x<18) && (y>25) && (y<33)) return false;
    //return true;
//}


//14cmx20cm
//var xmax = 57;
//var ymax = 81;
//[>var xmax = 41;<]
//[>var ymax = 81;<]
//[>var xmax = 5;<]
//[>var ymax = 5;<]
//function inSublattice(x, y)
//{
    //var xc;
    //var yc;
    //var x2;
    //var y2;
    //var xm = 0.5*xmax;
    //var ym = 0.5*ymax;
    //if (x<0) return false;
    //if (x>xmax) return false;
    //if (y<0) return false;
    //if (y>ymax) return false;
    //[>if ((x>3) && (x<xmax-3) && (y>0.15*ymax) && (y<0.30*ymax)) return false;<]
    //[>if ((x>3) && (x<xmax-3) && (y>0.6*ymax) && (y<0.8*ymax)) return false;<]
    //[>x2 = (x-xm)*(x-xm);<]
    //xc = xm;
    //yc = 0.225*ymax;
    //x2 = (x-xc)*(x-xc)/(0.88*0.88*xm*xm);
    //y2 = (y-yc)*(y-yc)/(0.15*0.15*ym*ym);
    //if (Math.pow(x2,2.) + Math.pow(y2,2.) < 1.) return false;
    //xc = xm;
    //yc = 0.7*ymax;
    //x2 = (x-xc)*(x-xc)/(0.88*0.88*xm*xm);
    //y2 = (y-yc)*(y-yc)/(0.15*0.15*ym*ym);
    //if (Math.pow(x2,2.) + Math.pow(y2,2.) < 1.) return false;
    //return true;
//}

//30cmx2cm
//var xmax = 121;
//var ymax = 7;
//var xmax = 41;
//var ymax = 81;
//var xmax = 5;
//var ymax = 5;
function inSublattice(x, y)
{
    if (x<0) return false;
    if (x>xmax) return false;
    if (y<0) return false;
    if (y>ymax) return false;
    return true;
}

//var xmax = 81;
//var ymax = 81;
//function inSublattice(x, y)
//{
    //if (x<0) return false;
    //if (x>xmax) return false;
    //if (y<0) return false;
    //if (y>ymax) return false;
    //var xm = 0.5*xmax;
    //var ym = 0.5*ymax;
    //if ((x-xm)*(x-xm)+(y-ym)*(y-ym) < (0.3*0.3*xmax*xmax)) return false;
    //return true;
//}

//var xmax = 3;
//var ymax = 33;
//[>var xmax = 9;<]
//[>var ymax = 801;<]
//function inSublattice(x, y)
//{
    //if (x<0) return false;
    //if (x>xmax) return false;
    //if (y<0) return false;
    //if (y>ymax) return false;
    //return true;
//}

function reversePath(i1,i2,path)
{
    var i;
    var jlim = (i2-i1+1)/2;
    var temp;
    for (j=0; j<jlim; j++)
    {
        //slower to use individual values
        //temp = path[i1+j][0];
        //path[i1+j][0] = path[i2-j][0];
        //path[i2-j][0] = temp;
        //temp = path[i1+j][1];
        //path[i1+j][1] = path[i2-j][1];
        //path[i2-j][1] = temp;
        //faster to swap arrays directly
        temp = path[i1+j];
        path[i1+j] = path[i2-j];
        path[i2-j] = temp;
    }
}

//Naive method, reversing whole walk each time
//function backbite(n,path)
//{
    //var i, j;
    //var x, y;
    //var dx, dy;
    //var xedge, yedge;
    //var iedge, add_edge;
    //[>choose a random end<]
    //[>choose a random neighbour<]
    //[>check if its in the sublattice<]
    //[>check if its in the path<]
    //[>if it is - then reverse loop<]
    //[>if it is not - add it to the end<]
    //[>To make things simple for the bulk of the code,<]
    //[>I'll always reverse the walk so that<]
    //[>the right hand end is always chosen<]
    //if (Math.floor(Math.random()*2) == 0)
    //{
        //[>choose left hand end - reverse whole walk<]
        //[>suboptimal - definitely slower than it needs to be<]
        //[>as it forces everything to be O(n)<]
        //reversePath(0,n-1,path);
    //}
    //[>Now choose a random step direction<]
    //switch (Math.floor(Math.random()*4))
    //{
        //case 0:
            //step = [1,0];
            //break;
        //case 1:
            //step = [-1,0];
            //break;
        //case 2:
            //step = [0,1];
            //break;
        //case 3:
            //step = [0,-1];
            //break;
    //}
    //var neighbour = [path[n-1][0] + step[0],path[n-1][1] + step[1]];
    //[>check to see if neighbour is in sublattice<]
    //if (inSublattice(neighbour[0],neighbour[1]))
    //{
        //[>Now check to see if it's already in path<]
            //var inPath = false;
            //for (j=n-2; j>=0; j--)
            //{
                //[>if (neighbour == path[j])<]
                //if ((neighbour[0] == path[j][0]) && (neighbour[1] == path[j][1]))
                //{
                    //inPath = true;
                    //break;
                //}
            //}
            //if (inPath)
            //{
                //reversePath(j+1,n-1,path);
            //}
            //else
            //{
                //n++;
                //path[n-1] = neighbour;
            //}
    //}
    //return n;
//}

function backbite_left(step,n,path)
{
    //choose left hand end
    var neighbour = [path[0][0] + step[0],path[0][1] + step[1]];
    //check to see if neighbour is in sublattice
    if (inSublattice(neighbour[0],neighbour[1]))
    {
        //Now check to see if it's already in path
        var inPath = false;
        //for (j=1; j<n; j++)
        for (j=1; j<n; j+=2)
        {
            //if (neighbour == path[j])
            if ((neighbour[0] == path[j][0]) && (neighbour[1] == path[j][1]))
            {
                inPath = true;
                break;
            }
        }
        if (inPath)
        {
            reversePath(0,j-1,path);
        }
        else
        {
            left_end = !left_end;
            reversePath(0,n-1,path);
            n++;
            path[n-1] = neighbour;
        }
    }
    return n;
}

function backbite_right(step,n,path)
{
//choose right hand end
    var neighbour = [path[n-1][0] + step[0],path[n-1][1] + step[1]];
//check to see if neighbour is in sublattice
    if (inSublattice(neighbour[0],neighbour[1]))
    {
        //Now check to see if it's already in path
            var inPath = false;
        //for (j=n-2; j>=0; j--)
        for (j=n-2; j>=0; j-=2)
        {
            //if (neighbour == path[j])
                if ((neighbour[0] == path[j][0]) && (neighbour[1] == path[j][1]))
                {
                    inPath = true;
                    break;
                }
        }
        if (inPath)
        {
            reversePath(j+1,n-1,path);
        }
        else
        {
            n++;
            path[n-1] = neighbour;
        }
    }
    return n;
}

//Slightly more sophisticated, only reversing if new site found
function backbite(n,path)
{
    //var i, j;
    //var x, y;
    //var dx, dy;
    //var xedge, yedge;
    //var iedge, add_edge;
    //choose a random end
    //choose a random neighbour
    //check if its in the sublattice
    //check if its in the path
    //if it is - then reverse loop
    //if it is not - add it to the end
    //the right hand end is always chosen
    //Choose a random step direction
    var step;
    switch (Math.floor(Math.random()*4))
    {
        case 0:
            step = [1,0];
            break;
        case 1:
            step = [-1,0];
            break;
        case 2:
            step = [0,1];
            break;
        case 3:
            step = [0,-1];
            break;
    }
    if (Math.floor(Math.random()*2) == 0)
    {
        n = backbite_left(step,n,path);
    }
    else
    {
        n = backbite_right(step,n,path);
    }
    return n;
}

function path_to_string(n,path)
{
    var i;
    var path_string = "[["+path[0]+"]";
    for (i=1; i<n; i++)
    {
        path_string = path_string + ",[" + path[i] + "]";
    }

    path_string += "]";
    return(path_string);
}

//function generate_hamiltonian_path(n,q)
generate_hamiltonian_path = function (q)
{
    //initialize path
    //var path = new Array(n*n);
    //var path = new Array(100000);
    //var path = new Array((xmax+1)*(ymax+1));
    path[0] = [Math.floor(Math.random()*(xmax+1)),
    Math.floor(Math.random()*(ymax+1))];
    //path[0] = [0,0];
    n = 1;
    //nattempts = 1+q*10.0 * (xmax+1) * (ymax+1) * Math.pow(Math.log(2.+(xmax+1)*(ymax+1)),2);
    if (must_fill)
    {
    nattempts = 1 + q*10.0 * (xmax+1) * (ymax+1) * Math.pow(Math.log(2.+(xmax+1)*(ymax+1)),2);
    while (n < (xmax+1)*(ymax+1))
    {
        for (i=0; i<nattempts; i++)
        {
            n = backbite(n,path);
        }
    }
}
else
{
    nattempts = q*10.0 * (xmax+1) * (ymax+1) * Math.pow(Math.log(2.+(xmax+1)*(ymax+1)),2);
        for (i=0; i<nattempts; i++)
        {
            n = backbite(n,path);
        }
}
    return [n,path];
}

generate_hamiltonian_circuit = function (q)
{
    //Generates circuits, but because we are subsampling circuits
    //from the set of paths it is in fact not straightforward to
    //sample uniformly at random from the set of circuits. Quite a subtle
    //argument which I won't reproduce here.
    result = generate_hamiltonian_path(q);
    var n = result[0];
    var path = result[1];
    //var path = generate_hamiltonian_path(q);
    var nmax = xmax*ymax;
    var success;
    var min_dist = 1 + (n % 2);
    while (Math.abs(path[n-1][0] - path[0][0])
           + Math.abs(path[n-1][1] - path[0][1]) != min_dist)
    {
        n = backbite(n,path);
    }
    return [n,path];
}

exports.refresh_path = function (x, y)
{
    //var nstring = prompt("Grid size = ?","10");
    //var n = parseInt(document.path_parameters.elements["n"].value);
    //xmax = -1+parseInt(document.path_parameters.elements["x"].value);
    //ymax = -1+parseInt(document.path_parameters.elements["y"].value);
    //var q = parseFloat(document.path_parameters.elements["q"].value);
    //var is_circuit = parseFloat(document.path_parameters.elements["is_circuit"].checked);
    //must_fill = document.path_parameters.elements["must_fill"].checked;
    //var is_circuit = document.path_parameters.elements["is_circuit"].checked;
    xmax = x-1;
    ymax = y-1;
    var q = 1.0;
    must_fill = true;
    var is_circuit = false;
    //var path;
    if (is_circuit)
    {
        result = generate_hamiltonian_circuit(q);
        //var n = result[0];
        n = result[0];
        var path = result[1];
    }
    else
    {
        result = generate_hamiltonian_path(q);
        //var n = result[0];
        n = result[0];
        var path = result[1];
    }
    //var text_box = document.getElementById("path_text");
    //text_box.value = path_to_string(n,path);
    //draw_path(n,path);
    return path;
}

function move_r()
{
    switch (Math.floor(Math.random()*4))
    {
        case 0:
            step = [1,0];
            break;
        case 1:
            step = [-1,0];
            break;
        case 2:
            step = [0,1];
            break;
        case 3:
            step = [0,-1];
            break;
    }
    if (left_end)
    {
        n = backbite_left(step,n,path);
    }
    else
    {
        n = backbite_right(step,n,path);
    }
    draw_path(n,path);
    return;
}

function move_R()
{
    for (var i=0; i<100; i++)
    {
        switch (Math.floor(Math.random()*4))
        {
            case 0:
                step = [1,0];
                break;
            case 1:
                step = [-1,0];
                break;
            case 2:
                step = [0,1];
                break;
            case 3:
                step = [0,-1];
                break;
        }
        if (left_end)
        {
            n = backbite_left(step,n,path);
        }
        else
        {
            n = backbite_right(step,n,path);
        }
    }
    draw_path(n,path);
    return;
}

function move_e()
{
    //e: random step, chooses either end at random
    var old_left_end = left_end;
    switch (Math.floor(Math.random()*4))
    {
        case 0:
            step = [1,0];
            break;
        case 1:
            step = [-1,0];
            break;
        case 2:
            step = [0,1];
            break;
        case 3:
            step = [0,-1];
            break;
    }
    if (Math.random() < 0.5)
    {
        left_end = !left_end;
    }

    if (left_end)
    {
        n = backbite_left(step,n,path);
    }
    else
    {
        n = backbite_right(step,n,path);
    }
    left_end = old_left_end;
    draw_path(n,path);
    return;
}

function move_E()
{
    //E: 100 random steps, chooses either end at random
    var old_left_end = left_end;
    for (var i=0; i<100; i++)
    {
        switch (Math.floor(Math.random()*4))
        {
            case 0:
                step = [1,0];
                break;
            case 1:
                step = [-1,0];
                break;
            case 2:
                step = [0,1];
                break;
            case 3:
                step = [0,-1];
                break;
        }
        if (Math.random() < 0.5)
        {
            left_end = !left_end;
        }

        if (left_end)
        {
            n = backbite_left(step,n,path);
        }
        else
        {
            n = backbite_right(step,n,path);
        }
    }
    left_end = old_left_end;
    draw_path(n,path);
    return;
}
