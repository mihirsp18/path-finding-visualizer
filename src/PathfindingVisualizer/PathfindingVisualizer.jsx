import React, {
  Component
} from "react";

import Node from "./Node/Node.jsx";
// import {showPopUp} from "./Tutorial/Tutorial.jsx";

import {
  dijkstra,
  getNodesInShortestPathOrder
} from "../algorithms/dijkstra";
import {
  astar,
  getNodesInShortestPathOrderAstar,
} from "../algorithms/Astar";
import {
  greedyBFS,
  getNodesInShortestPathOrderGreedyBFS,
} from "../algorithms/greedyBestFirstSearch";
import {
  bidirectionalGreedySearch,
  getNodesInShortestPathOrderBidirectionalGreedySearch,
} from "../algorithms/bidirectionalGreedySearch";
import {
  randomMaze
} from "../maze/randomMaze.js";
import {
  recursiveDivisionMaze
} from "../maze/recursiveDivision.js";
import {
  verticalMaze
} from "../maze/verticalMaze.js";
import {
  horizontalMaze
} from "../maze/horizontalMaze.js";

import "./PathfindingVisualizer.css";

// Defining initial state of start and finish.

let row_max_length = 26;
let col_max_length = 46;

let START_NODE_ROW;
let START_NODE_COL;
let FINISH_NODE_ROW;
let FINISH_NODE_COL;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      status: "Starting",
      weight: 1,
      changeWeight: false,
      distanceToBeTraveled: 0,
      setStart: false,
      setEnd: false,
      algo: 0,
      generatingMaze: false,
      speed: 12,
      mazeSpeed: 10,
      constructingMaze: false,
    };
  }

  // Creating grid
  componentDidMount() {
    // var win = window,
    // doc = document,
    // docElem = doc.documentElement,
    // body = doc.getElementsByTagName('body')[0],
    //   x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    //   y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    let x = document.getElementById('gridBody').clientWidth - 4
    let y = document.getElementById('gridBody').clientHeight - 4
    // row_max_length = (y / 22) / 1.45;
    row_max_length = Math.ceil(y / 24);
    col_max_length = Math.ceil(x / 24);
    START_NODE_ROW = Math.floor(row_max_length / 2) -2;
    START_NODE_COL = 6;
    FINISH_NODE_ROW = Math.floor(row_max_length / 2) -2;
    FINISH_NODE_COL = Math.floor(col_max_length - 6);

    const grid = getInitialGrid();
    this.setState({
      grid
    });
  }

  ClearWalls() {
    const grid = getInitialGrid();
    this.setState({
      grid
    });
  }


  // On pressing the mouse down
  handleMouseDown(row, col) {
    if (this.state.status !== "Starting") return;
    if (!(this.setStart || this.setEnd)) {
      let newGrid = [];

      if (this.state.changeWeight) {
        newGrid = getNewGridWithWeightToggled(
          this.state.grid,
          row,
          col,
          this.state.weight
        );
      } else {
        newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      }

      this.setState({
        grid: newGrid,
        mouseIsPressed: true
      });
    } else if (this.setStart) {

    } else if (this.setEnd) {

    }

  }

  // On entering the new node element.
  handleMouseEnter(row, col) {
    if (this.state.status !== "Starting") return;
    if (this.setStart || this.setEnd) return;
    if (!this.state.mouseIsPressed) return;

    let newGrid = [];

    if (this.state.changeWeight) {
      newGrid = getNewGridWithWeightToggled(
        this.state.grid,
        row,
        col,
        this.state.weight
      );
    } else {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    }

    this.setState({
      grid: newGrid,
      mouseIsPressed: true
    });
  }

  // When we release the mouse
  handleMouseUp() {
    if (this.state.status !== "Starting") return;
    this.setState({
      mouseIsPressed: false
    });
  }

  setAlgoAstar() {
    this.setState({
      algo: 1
    });
  }
  setAlgoDijkstra() {
    this.setState({
      algo: 2
    });
  }
  setAlgoGreedyBFS() {
    this.setState({
      algo: 3
    });
  }
  setAlgoBiGreedy() {
    this.setState({
      algo: 4
    });
  }



  visualizeDijkstra() {
    this.setState({
      status: "Calculating Shortest Path"
    });
    const {
      grid
    } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animatePath(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeAstar() {
    this.setState({
      status: "Calculating Shortest Path"
    });
    const {
      grid
    } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(
      finishNode
    );
    this.animatePath(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeGreedyBFS() {
    this.setState({
      status: "Calculating Shortest Path"
    });
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = greedyBFS(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderGreedyBFS(
        finishNode
      );
      this.animatePath(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeBidirectionalGreedySearch() {
    this.setState({
      status: "Calculating Shortest Path"
    });
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bidirectionalGreedySearch(
      grid,
      startNode,
      finishNode
    );
    const visitedNodesInOrderStart = visitedNodesInOrder[0];
    const visitedNodesInOrderFinish = visitedNodesInOrder[1];
    const isShortedPath = visitedNodesInOrder[2];
    const nodesInShortestPathOrder = getNodesInShortestPathOrderBidirectionalGreedySearch(
      visitedNodesInOrderStart[visitedNodesInOrderStart.length - 1],
      visitedNodesInOrderFinish[visitedNodesInOrderFinish.length - 1]
    );
    this.animateBidirectionalAlgorithm(
      visitedNodesInOrderStart,
      visitedNodesInOrderFinish,
      nodesInShortestPathOrder,
      isShortedPath
    );
}

  visualize() {
    if(!this.state.constructingMaze){
      if (this.state.algo === 1) {
        this.visualizeAstar();
      } else if (this.state.algo === 2) {
        this.visualizeDijkstra();
      } else if (this.state.algo === 3) {
        this.visualizeGreedyBFS();
      } else if (this.state.algo === 4) {
        this.visualizeBidirectionalGreedySearch();
      }
    }
  }

  animatePath(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      // When we reach the last element in visitedNodesInOrder.
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.setState({
            status: "Shortest Path"
          });
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.speed * i);
        return;
      }

      if (i === visitedNodesInOrder.length - 1) continue;
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isWeight) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visitedWeight";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, this.state.speed * i);
    }
  }
  animateBidirectionalAlgorithm(
  visitedNodesInOrderStart,
  visitedNodesInOrderFinish,
  nodesInShortestPathOrder,
  isShortedPath
) {
  let len = Math.max(
    visitedNodesInOrderStart.length,
    visitedNodesInOrderFinish.length
  );
  for (let i = 1; i <= len; i++) {
    let nodeA = visitedNodesInOrderStart[i];
    let nodeB = visitedNodesInOrderFinish[i];
    if (i === visitedNodesInOrderStart.length) {
      setTimeout(() => {
        let visitedNodesInOrder = getVisitedNodesInOrder(
          visitedNodesInOrderStart,
          visitedNodesInOrderFinish
        );
        if (isShortedPath) {
          this.setState({
            status: "Shortest Path"
          });
          this.animateShortestPath(
            nodesInShortestPathOrder,
            visitedNodesInOrder
          );
        }
        else {
          this.setState({status: "Shortest Path", distanceToBeTraveled: Infinity,  algo: -1});
        }
      }, i * this.state.speed);
      return;
    }
    console.log("sup")
    setTimeout(() => {
      //visited nodes
      if (nodeA !== undefined)
        document.getElementById(`node-${nodeA.row}-${nodeA.col}`).className =
          "node node-visited";
      if (nodeB !== undefined)
        document.getElementById(`node-${nodeB.row}-${nodeB.col}`).className =
          "node node-visited";
    }, i * this.state.speed);
  }
}

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (nodesInShortestPathOrder[i].isWeight) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-path-weight";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-path";
        }
      }, this.state.speed * 5 * i);
    }
    let timeTaken =
      nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1].distance;
    this.setState({ distanceToBeTraveled: timeTaken,  algo: -1});
  }

  animateMaze = (walls) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          this.ClearWalls();
          let newGrid = getNewGridWithMaze(this.state.grid, walls);
          this.setState({
            grid: newGrid,
            constructingMaze: false
          });
        }, i * this.state.mazeSpeed);
        return;
      }
      let wall = walls[i];
      let node = this.state.grid[wall[0]][wall[1]];
      setTimeout(() => {
        //Walls
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall";
      }, i * this.state.mazeSpeed);
    }
  };

  generateRandomMaze() {
    if (this.state.constructingMaze) {
      return;
    }
    this.setState({
      constructingMaze: true
    });
    setTimeout(() => {
      const {
        grid
      } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = randomMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    }, this.state.mazeSpeed*3);
  }
  generateRecursiveDivisionMaze() {
    if (this.state.constructingMaze) {
      return;
    }
    this.setState({
      constructingMaze: true
    });
    setTimeout(() => {
      const {
        grid
      } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = recursiveDivisionMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    }, this.state.mazeSpeed);
  }
  generateVerticalMaze() {
    if (this.state.constructingMaze) {
      return;
    }
    this.setState({
      constructingMaze: true
    });
    setTimeout(() => {
      const {
        grid
      } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = verticalMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    }, this.state.mazeSpeed);
  }

  generateHorizontalMaze() {
    if (this.state.constructingMaze) {
      return;
    }
    this.setState({
      constructingMaze: true
    });
    setTimeout(() => {
      const {
        grid
      } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = horizontalMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    }, this.state.mazeSpeed);
  }



  weightChangeHandler = (event) => {
    this.setState({
      weight: event.target.value
    });
  };

  pointChangeHandler = () => {
    if (this.notCorrect()) return; //To check if the provided value is suitable or not.

    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node";
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = "node";

    START_NODE_ROW = parseInt(document.getElementById("start_row").value);
    START_NODE_COL = parseInt(document.getElementById("start_col").value);
    FINISH_NODE_ROW = parseInt(document.getElementById("end_row").value);
    FINISH_NODE_COL = parseInt(document.getElementById("end_col").value);

    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node node-start";
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = "node node-finish";
  };

  notCorrect = () => {
    if (
      isNaN(parseInt(document.getElementById("start_row").value)) ||
      isNaN(parseInt(document.getElementById("start_col").value)) ||
      isNaN(parseInt(document.getElementById("end_row").value)) ||
      isNaN(parseInt(document.getElementById("end_col").value))
    )
      return true;

    if (
      parseInt(document.getElementById("start_row").value) > row_max_length ||
      parseInt(document.getElementById("start_col").value) > col_max_length
    )
      return true;
    if (
      parseInt(document.getElementById("start_row").value) < 0 ||
      parseInt(document.getElementById("start_col").value) < 0
    )
      return true;

    if (
      parseInt(document.getElementById("end_row").value) > row_max_length ||
      parseInt(document.getElementById("end_col").value) > col_max_length
    )
      return true;
    if (
      parseInt(document.getElementById("end_row").value) < 0 ||
      parseInt(document.getElementById("end_col").value) < 0
    )
      return true;

    return false;
  };

  toggleWeight = () => {
    const temp = this.state.changeWeight;
    this.setState({
      changeWeight: !temp
    });
  };

  render() {
      const {
        grid,
        mouseIsPressed,
        status,
        distanceToBeTraveled,
        algo,
      } = this.state;
      let button_task = ( <
        div className = "rBtn" >
        <
        div className = "dropdown leftBtn" >
        <
        p className = "dropbtn" > Select an algorithm < /p> <
        div className = "dropdown-content" >
        <
        a onClick = {
          () => this.setAlgoAstar()
        } > A * Search < /a> <
        a onClick = {
          () => this.setAlgoDijkstra()
        } > Dijkstra < /a><
        a onClick = {
          () => this.setAlgoGreedyBFS()
        } > Greed BFS < /a>
        <
        a onClick = {
          () => this.setAlgoBiGreedy()
        } > Bidirectional Greed Search < /a> < /
        div > <
        /div> <
        div className = "rightBtn" >
        <
        p className = "buttonContainer"
        onClick = {
          () => this.visualize()
        } >
        Start Visualizing!
        <
        /p> < /
        div > <
        /div>
      );

      if (status === "Shortest Path") {
        button_task = ( <
          div

          className = "buttonContainer"
          style = {
            {
              width: "10%",
              margin: "auto"
            }
          } >
          <
          h2 className = "btn"
          href = "#"
          onClick = {
            () => window.location.reload(false)
          } >
          Reset <
          /h2> < /
          div >

        );
      } else if (status === "Calculating Shortest Path") {
        button_task = < h3 className = "running" > Running... < /h3>;
      }

      let changeWeightText = "False";

      if (this.state.changeWeight) changeWeightText = "True";

      let textBox = ( <
        div className = "textBox" >
        <
        div >
        <
        div className = "weightContainer" >
        <
        label htmlFor = "quantity" > &emsp;&ensp; Set Weight < /label> <
        input type = "number"
        id = "quantity"
        name = "quantity"
        min = "1"
        max = "10"
        onChange = {
          this.weightChangeHandler
        }
        defaultValue = "1" /
        >
        <
        /div> <
        div className = "weightContainer" >
        <
        label htmlFor = "quantity" > Toggle Weight < /label> <
        button onClick = {
          this.toggleWeight
        } > {
          changeWeightText
        } < /button> < /
        div > <
        /div>

        <
        div >
        <
        div className = "startPointContainer" >
        <
        label htmlFor = "point" > &ensp;Start Point: < /label> <
        input type = "number"
        name = "point"
        id = "start_row"
        min = "0"
        max = {
          row_max_length - 1
        }
        onChange = {
          this.pointChangeHandler
        }
        defaultValue = {
          START_NODE_ROW
        } >
        <
        /input> <
        input type = "number"
        name = "point"
        id = "start_col"
        min = "0"
        max = {
          col_max_length - 1
        }
        onChange = {
          this.pointChangeHandler
        }
        defaultValue = {
          START_NODE_COL
        } >
        <
        /input>

        <
        /div> <
        div className = "endPointContainer" >
        <
        label htmlFor = "point" > &ensp; End Point: < /label> <
        input type = "number"
        name = "point"
        id = "end_row"
        min = "0"
        max = {
          row_max_length - 1
        }
        onChange = {
          this.pointChangeHandler
        }
        defaultValue = {
          FINISH_NODE_ROW
        } >
        <
        /input> <
        input type = "number"
        name = "point"
        id = "end_col"
        min = "0"
        max = {
          col_max_length - 1
        }
        onChange = {
          this.pointChangeHandler
        }
        defaultValue = {
          FINISH_NODE_COL
        } >
        <
        /input> < /
        div > <
        /div>


        <
        div>
        <
        div className = "dropdown mazePick" >
        <
        p className = "dropbtn" > Generate a Maze < /p> <
        div className = "dropdown-content" >
        <
        a onClick = {
          () => this.generateRandomMaze()
        } > Random Maze < /a> <
        a onClick = {
          () => this.generateRecursiveDivisionMaze()
        } > Recursive Division Maze < /a>
        <
        a onClick = {
          () => this.generateVerticalMaze()
        } > Vertical Devision Maze < /a> <
        a onClick = {
          () => this.generateHorizontalMaze()
        } > Horizontal Devision Maze < /a>< /
        div > <
        /div> <
        p className = "buttonRand2"
        onClick = {
          () => this.ClearWalls()
        } >
        Clear Walls <
        /p> < /
        div > <
        div > {
          button_task
        } < /div>
        < / div >
      );

      if (status === "Calculating Shortest Path") {
        textBox = ( <
          div className = "space" > < /div>
        );
      } else if (status === "Shortest Path") {
        textBox = ( <
          div > {
            button_task
          } <
          div className = "spaceL1" > < /div> < /
          div >
        );
      }
      let heading;
      if (algo === 0) {
        heading = ( < h2 > Select a Pathfinding Algorithm! < /h2>)
        }
        else if (algo === 1) {
          heading = ( < h2 > A * Search Pathfinding Algorithm < /h2>)
          }
          else if (algo === 2) {
            heading = ( < h2 > Dijkstra Pathfinding Algorithm < /h2>)
            }
            else if (algo === 3) {
              heading = ( < h2 >Greedy Best-first Search Algorithm < /h2>)
              }
              else if (algo === 4) {
                heading = ( < h2 > Bidirectional Greedy Search Algorithm < /h2>)
                }
            else if (algo === -1) {
              heading = ( < h2 > Distance travelled is: {distanceToBeTraveled} < /h2>)
              }

              return (
                <div className = "pathfindingVisualizer" >
                <
                div className = "container" >
                <
                div className = "heading" >
                <
                h1 > Pathfinding Visualizer < /h1> < /
                div > <
                div className = "heading" >
                <
                h3 > {
                  heading
                } < /h3> < /
                div > {
                  textBox
                } <
                /div>

                <
                div className = "visualGridContainer"
                id = "gridBody" >
                <
                table className = "grid"
                style = {
                  {
                    borderSpacing: "0"
                  }
                } >
                <
                tbody > {
                  grid.map((row, rowIndex) => {
                    return ( <
                      tr key = {
                        rowIndex
                      } > {
                        row.map((node, nodeIndex) => {
                          const {
                            isStart,
                            isFinish,
                            isWall,
                            isWeight
                          } = node; //Extracting from the node
                          return ( <
                            Node row = {
                              rowIndex
                            }
                            col = {
                              nodeIndex
                            }
                            key = {
                              rowIndex + "-" + nodeIndex
                            }
                            isStart = {
                              isStart
                            }
                            isFinish = {
                              isFinish
                            }
                            isWall = {
                              isWall
                            }
                            isWeight = {
                              isWeight
                            }
                            mouseIsPressed = {
                              mouseIsPressed
                            }
                            onMouseDown = {
                              (row, col) =>
                              this.handleMouseDown(row, col)
                            }
                            onMouseEnter = {
                              (row, col) =>
                              this.handleMouseEnter(row, col)
                            }
                            onMouseUp = {
                              () => this.handleMouseUp()
                            } >
                            <
                            /Node>
                          );
                        })
                      } <
                      /tr>
                    );
                  })
                } <
                /tbody> < /
                table >
                <footer>
                  <p class="footer__author">Check out the source code at: &ensp;<a href="https://github.com/mihirsp18/path-finding-visualizer"><i class="fab fa-github"></i></a></p>
                </footer>
                </div>
                </div >
              );
            }
          }

          const getVisitedNodesInOrder = (
  visitedNodesInOrderStart,
  visitedNodesInOrderFinish
) => {
  let visitedNodesInOrder = [];
  let n = Math.max(
    visitedNodesInOrderStart.length,
    visitedNodesInOrderFinish.length
  );
  for (let i = 0; i < n; i++) {
    if (visitedNodesInOrderStart[i] !== undefined) {
      visitedNodesInOrder.push(visitedNodesInOrderStart[i]);
    }
    if (visitedNodesInOrderFinish[i] !== undefined) {
      visitedNodesInOrder.push(visitedNodesInOrderFinish[i]);
    }
  }
  return visitedNodesInOrder;
};

          const getInitialGrid = () => {
            const grid = [];
            for (let row = 0; row < row_max_length; row++) {
              const currentRow = [];
              for (let col = 0; col < col_max_length; col++) {
                currentRow.push(createNode(col, row));
              }
              grid.push(currentRow);
            }

            return grid;
          };

          const createNode = (col, row) => {
            return {
              col,
              row,
              isStart: row === START_NODE_ROW && col === START_NODE_COL,
              isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
              distance: Infinity,
              totalDistance: Infinity,
              isVisited: false,
              isWall: false,
              isWeight: false,
              previousNode: null,
              weight: 0,
              g: 0,
              f: 0,
              h: 0,
              neighbors: [],
              previous: undefined,
            };
          };

          const getNewGridWithMaze = (grid, walls) => {
            let newGrid = grid.slice();
            for (let wall of walls) {
              let node = grid[wall[0]][wall[1]];
              let newNode = {
                ...node,
                isWall: true,
              };
              newGrid[wall[0]][wall[1]] = newNode;
            }
            return newGrid;
          };


          const getNewGridWithWallToggled = (grid, row, col) => {
            const newGrid = [...grid];
            const node = newGrid[row][col];
            const newNode = {
              ...node, // copying other properties of the node
              isWall: !node.isWall,
            };
            newGrid[row][col] = newNode;
            return newGrid;
          };

          const getNewGridWithWeightToggled = (grid, row, col, weight) => {
            const newGrid = [...grid];
            const node = newGrid[row][col];
            const newNode = {
              ...node, // copying other properties of the node
              isWeight: !node.isWeight,
              weight: parseInt(weight),
            };
            newGrid[row][col] = newNode;
            return newGrid;
          };
