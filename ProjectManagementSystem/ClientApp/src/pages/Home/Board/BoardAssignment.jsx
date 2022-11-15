import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import assignmentService from "../../../services/assignmentService";
import moment from "moment";

import loading from "../../../assets/loading.gif";
import "./BoardAssignment.css";

const BoardAssignment = (props) => {
  const { id } = props.user;
  const todoId = uuidv4();
  const inProgressId = uuidv4();
  const inReviewId = uuidv4();
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState({
    [todoId]: {
      name: "To Do",
      items: [],
    },
    [inProgressId]: {
      name: "In Progress",
      items: [],
    },
    [inReviewId]: {
      name: "In Review",
      items: [],
    },
  });

  const fetchData = () => {
    assignmentService.getBoard(id).then((results) => {
      setIsLoading(false);
      if (results.data.todo.length !== 0) {
        results.data.todo.forEach((todoTask) => {
          todoTask.endedDate = moment(todoTask.endedDate).format("DD/MM/YYYY");
        });
      }
      if (results.data.inProgress.length !== 0) {
        results.data.inProgress.forEach((inProgressTask) => {
          inProgressTask.endedDate = moment(inProgressTask.endedDate).format(
            "DD/MM/YYYY"
          );
        });
      }
      if (results.data.inReview.length !== 0) {
        results.data.inReview.forEach((inReviewTask) => {
          inReviewTask.endedDate = moment(inReviewTask.endedDate).format(
            "DD/MM/YYYY"
          );
        });
      }
      setColumns({
        ...columns,
        [todoId]: {
          name: "To Do",
          items: results.data.todo,
        },
        [inProgressId]: {
          name: "In Progress",
          items: results.data.inProgress,
        },
        [inReviewId]: {
          name: "In Review",
          items: results.data.inReview,
        },
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    console.log(result);
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];

      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      assignmentService.updateStatus(result.draggableId, destColumn.name);

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return isLoading !== true ? (
    <div className="board-container">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className="board-column" key={columnId}>
              <div className="board-column-header">
                <p>{column.name}</p>
              </div>
              <div>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="board-column-body"
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "#d3d3d380",
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="card"
                                    style={{
                                      backgroundColor: snapshot.isDragging
                                        ? "#7000d9"
                                        : "#8400ff",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <p className="card-name">{item.name}</p>
                                    <div className="row">
                                      <div className="col-6">
                                        <p className="card-category">
                                          {item.category}
                                        </p>
                                      </div>
                                      <div className="col-6">
                                        <p className="card-category text-right">
                                          {item.endedDate}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
      <div className="board-column">
        <div className="board-column-header">
          <p>Complete</p>
        </div>
        <div>
          <div
            className="board-column-body"
            style={{
              background: "#d3d3d380",
            }}
          >
            {/* {column.items.map((item, index) => {
                    return (
                        <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        >
                        {(provided, snapshot) => {
                            return (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                userSelect: "none",
                                padding: 16,
                                margin: "0 0 8px 0",
                                minHeight: "50px",
                                backgroundColor: snapshot.isDragging
                                    ? "#263B4A"
                                    : "#456C86",
                                color: "white",
                                ...provided.draggableProps.style,
                                }}
                            >
                                {item.name}
                            </div>
                            );
                        }}
                        </Draggable>
                    );
                })} */}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ width: "70vw", height: "60vh" }} className="loading">
      <img src={loading} alt="Loading..." />
    </div>
  );
};

export default BoardAssignment;
