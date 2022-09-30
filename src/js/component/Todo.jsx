import React, {useEffect ,useState} from "react";

export const Todo = ()=> {

    const [inputValue, setInputValue] = useState("");
    const [list, setList] = useState([]); 
    const [disable,setDisable] = useState(false);
    const uri = "https://assets.breatheco.de/apis/fake/todos/user/sabahrahal";

    async function getTasksFetch() {
        try{
            const response = await fetch(uri); 

            if(!response.ok){
                alert("There was a problem");
                return; 
            }

            const body = await response.json(); 
            setList(body);
        } catch(error){
            console.log("FATAL ERROR ", error); 
        }
    }

    async function putTasksFetch(data){
        try{
            const request = await fetch(uri, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if(!request.ok){
                alert("There was a problem");
                return;                 
            }

            getTasksFetch();

        }catch(error){
            console.log("FATAL ERROR", error); 
        }
    }

    async function deleteTasksFetch(){
        try{
            const request = await fetch(uri, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            createTasksFetch();

        } catch(error){
            console.log("FATAL ERROR", error); 
        }
    }

    async function createTasksFetch(){
        try{
            const data = [];

            const response = await fetch(uri,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }); 
            if(!response.ok){
                alert("There was a problem");
                return; 
            }

            putTasksFetch([{label:"Create user", done: true}]);
            
        } catch{
            console.log("FATAL ERROR", error); 
        }
    }

    function items(){
        const array = list.filter((element)=>{
            return element.done == false; 
        })

        return array.length; 
    }

    useEffect(() => {
        getTasksFetch(); 
    }, []);
    
    return(    
  <div className="full-container">
            <h1 className="title">Todo List</h1>
            <div className="form">
                <form onSubmit={(event)=>{
                    event.preventDefault();
                    if(inputValue === "") return;

                    const objectList = {
                        label: inputValue,
                        done: false
                    }
                    const data = [...list, objectList];
                    setList(data);
                    setInputValue("");
                    putTasksFetch(data);
                }}>
                    <input placeholder="Write a Task" type="text" value={inputValue} onChange={(event)=>{
                      setInputValue(event.target.value);
                    }}/>

                </form>
            </div>
            <div className="list">
                <ul>
                   {       
                         list.map((listElement, index)=>{
                            if(listElement.done === true) return; 
                            return <li key={index} 
                                onMouseOver={()=>{
                                setDisable(true);
                            }}
                                onMouseOut={()=>{
                                setDisable(false);
                            }}
                            > {listElement.label}<a className={disable===false ? "trash disable" : "trash"} onClick={()=>{
                                const data = list.map((element,id)=>{
                                    if(index === id ){
                                        element.done = true;
                                    }
                                        return element;                                
                                });
                                setList(data);
                                putTasksFetch(data);
                            }}>X</a></li> })}
                    <div className="footer">
                        <span className="items">{items()==0 ? "No Tasks, add a new task" : items() + " Tasks pending"}</span>
                        <span className="final-list"onClick={deleteTasksFetch}>Delete All</span>
                    </div>
                </ul>
            </div> 
    </div>
    )
}