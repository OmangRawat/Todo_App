// Event Listeners
    document.getElementById("previous").addEventListener("click", prev_month); // go to previous month
    document.getElementById("next").addEventListener("click", next_month); // go to next month

    // show calender for previous month
    function prev_month(){
        if (calender.month == 0)
        {
            calender.year -= 1;
            calender.month = 11;
        }
        else
        {
            calender.month -= 1;
        }
        calender.show_calender(calender.month, calender.year);
        document.getElementById('modalbox').style.visibility = 'hidden';
    }

    // show calender for next month
    function next_month(){
        if (calender.month == 11)
        {
            calender.year += 1;
            calender.month = 0;
        }
        else
        {
            calender.month += 1;
        }
        calender.show_calender(calender.month, calender.year);
        document.getElementById('modalbox').style.visibility = 'hidden';
    }

    //show todo box for the date
    function show_todo_box(todo_date)
    {
        // Make modal box visible
        let m_box = document.getElementById("modalbox");
        m_box.style.visibility = "visible";
        m_box.innerHTML = "";

        // Make a div for putting elements
        let in_m_box = document.createElement("div");
        in_m_box.id = "in_m_box";
        in_m_box.innerHTML = "";
        m_box.appendChild(in_m_box);

        // Add heading as date
        let todo_box_heading = document.createElement("h2");
        todo_box_heading.innerText = todo_date + " " + calender.months[calender.month] + " " + calender.year;
        in_m_box.appendChild(todo_box_heading);

        // Create button for Adding New Todo
        var add_todo_btn = document.createElement("button");
        add_todo_btn.innerText = 'Add New Todo';
        add_todo_btn.id = 'day_' + todo_date;
        add_todo_btn.className = 'todo_add_btn';
        add_todo_btn.onclick = function()
        {
            show_add_todo_item(todo_date);
        };
        in_m_box.appendChild(add_todo_btn);
        
        // Add already added todos
        let todo_month_year = calender.month + " " + calender.year;
        let todo_items = calender.todolist?.[todo_month_year]?.[todo_date];
        if (todo_items?.length)
        {
            // Make todos grid
            items_grid = document.createElement("div");
            items_grid.id = "items_grid";
            in_m_box.appendChild(items_grid);
            for (let i = 0; i < todo_items.length; ++i)
            {
                // Add todo items
                let item = document.createElement('div');
                item.id = "todo_item" + i;
                item.className = "todo_item";
                item.innerText = todo_items[i]['item'];
                
                // Check for completed todos or not
                if (! todo_items[i]['done'])
                {
                    console.log("qwerty");
                    item.classList.add("todo_not_done");
                    let mark_as_done_btn = document.createElement("button");
                    mark_as_done_btn.id = "done_" + i;
                    mark_as_done_btn.className = "mark_as_done_btn";
                    mark_as_done_btn.innerText = "Mark as done";
                    mark_as_done_btn.onclick = function()
                    {
                        console.log(todo_items);
                        todo_items[i]['done'] = 1;
                        show_todo_box(todo_date);
                    }
                    item.appendChild(mark_as_done_btn);
                    console.log(mark_as_done_btn);
                }
                else
                {
                    item.classList.add("todo_done");
                    let completed_btn = document.createElement("button");
                    completed_btn.id = "complete_" + i;
                    completed_btn.className = "completed_task";
                    completed_btn.innerText = "Completed";
                    item.appendChild(completed_btn);
                }
                item.onclick = function()
                {
                    show_added_todo(i, todo_date, todo_items[i]['item']);
                }
                items_grid.appendChild(item);
            }
        }
        else
        {
            // If no todos then show message
            let no_todos = document.createElement("h3");
            no_todos.id = "no_todos";
            no_todos.innerText = "No todos yet, Lets add Some !!";
            in_m_box.appendChild(no_todos);
        }
    }

    // show add todo item box
    function show_add_todo_item(todo_date)
    {
        // Get add todo box
        console.log("show_add_todo_item", todo_date);
        document.getElementById("modal_todo_box").style.visibility = "visible";
        let add_todo_box = document.getElementById("in_modal_todo_box");
        add_todo_box.innerHTML = "";
        console.log(add_todo_box);

        // Add Date element
        var date_heading = document.createElement('p');
        date_heading.innerText = todo_date + " " + calender.months[calender.month] + " " + calender.year;
        add_todo_box.appendChild(date_heading);

        // Add close button
        var close_btn = document.createElement('button');
        close_btn.innerText = "X";
        close_btn.className = "close_btn"
        close_btn.onclick = function()
        {
            document.getElementById("modal_todo_box").style.visibility = "hidden"; 
        }
        add_todo_box.appendChild(close_btn);

        // Add form for adding todo
        var todo_form = document.createElement('form');
        todo_form.id = "form_" + todo_date;
        todo_form.className = "add_todo_form";
        todo_form.setAttribute("method", "post");
        todo_form.setAttribute("action", "javascript:void(0);");
        var todo_input = document.createElement('input');
        var todo_add_submit = document.createElement('button');
        todo_add_submit.innerText = "Submit Todo";
        todo_add_submit.onclick = function(){
            let input_item = todo_input.value;
            add_todo_item(todo_date, input_item);
        };
        todo_form.appendChild(todo_input);
        todo_form.appendChild(todo_add_submit);
        add_todo_box.appendChild(todo_form);
    }

    // add todo item to calender
    function add_todo_item(todo_date, todo_item)
    {
        // Checking for empty todo items
        if (!todo_item)
        {
            document.getElementById("modal_todo_box").style.visibility = "hidden";
            show_todo_box(todo_date);
            return;
        }

        let add_todo_date = todo_date;
        let add_todo_month = calender.month;
        let add_todo_year = calender.year;
        let todo_month_year = add_todo_month + " " + add_todo_year;
        if (!calender.todolist.hasOwnProperty(todo_month_year))
        {
            calender.todolist[todo_month_year] = {}
        }
        if (!calender.todolist[todo_month_year].hasOwnProperty(add_todo_date))
        {
            calender.todolist[todo_month_year][add_todo_date] = []
        }
        let len = calender.todolist[todo_month_year][add_todo_date].length;

        // checking it added date is not before today
        let today = new Date();
        today.setDate(today.getDate() - 1);
        let adding_date = new Date(add_todo_year, add_todo_month, add_todo_date);
        if (adding_date < today)
        {
            calender.todolist[todo_month_year][add_todo_date].push({'id': len + 1, 'item': todo_item, 'done': 1});
        }
        else
        {
            calender.todolist[todo_month_year][add_todo_date].push({'id': len + 1, 'item': todo_item, 'done': 0});
        }
        // calender.todolist[todo_month_year][add_todo_date].push({'id': len + 1, 'item': todo_item, 'done': 0});
        document.getElementById("modal_todo_box").style.visibility = "hidden";
        show_todo_box(todo_date);
        localStorage.setItem("prev_todolist", JSON.stringify(calender.todolist));
    }

    // show added todo
    function show_added_todo(todo_id, todo_date, todo_item)
    {
        document.getElementById("modal_todo_box").style.visibility = "visible";
        let add_todo_box = document.getElementById("in_modal_todo_box");
        add_todo_box.innerHTML = "";
        console.log(add_todo_box);

        // Add Date element
        var date_heading = document.createElement('p');
        date_heading.innerText = todo_date + " " + calender.months[calender.month] + " " + calender.year;
        add_todo_box.appendChild(date_heading);

        // Add close button
        var close_btn = document.createElement('button');
        close_btn.innerText = "X";
        close_btn.className = "close_btn"
        close_btn.onclick = function()
        {
            document.getElementById("modal_todo_box").style.visibility = "hidden"; 
        }
        add_todo_box.appendChild(close_btn);

        // show todo item
        var item = document.createElement("p");
        item.id = "showtodo_" + todo_date;
        item.className = "show_todo_item";
        item.innerText = todo_item;
        add_todo_box.appendChild(item);

        let todo_month_year = calender.month + " " + calender.year;
        let todo_items = calender.todolist?.[todo_month_year]?.[todo_date];
        console.log(todo_id, todo_date, todo_item, todo_items);
        if (! todo_items[todo_id]['done'])
        {
            let mark_as_done_btn = document.createElement("button");
            mark_as_done_btn.id = "done_" + todo_id;
            mark_as_done_btn.className = "mark_as_done_btn";
            mark_as_done_btn.innerText = "Mark as done";
            mark_as_done_btn.onclick = function()
            {
                todo_items[todo_id]['done'] = 1;
                show_todo_box(todo_date);
                show_added_todo(todo_id, todo_date, todo_item);
            }
            add_todo_box.appendChild(mark_as_done_btn);
            console.log(mark_as_done_btn);
        }
        else
        {
            item.classList.add("todo_done");
            let completed_btn = document.createElement("button");
            completed_btn.id = "complete_" + todo_id;
            completed_btn.className = "completed_task";
            completed_btn.innerText = "Completed";
            add_todo_box.appendChild(completed_btn);
        }
    }

// Calender Class
class Calender{
    constructor()
    {
        let today = new Date();
        this.today_date = today.getDate();
        this.today_month = today.getMonth();
        this.today_year = today.getFullYear();
        this.month = -1;
        this.year = -1;
        this.todolist = {}; 
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "Decemeber"]
    }
    // // add todo item
    // add_entry(date, month, year, todo_item)
    // {
    //     key = {month} + "," + {year};
    //     if ((key in this.todolist) && (date in this.todolist[key]))
    //     {
    //         this.todolist[key][String(date)].push({"task":todo_item, "checked":false});
    //     }
    //     else
    //     {
    //         this.todolist[key][String(date)] = [{"task":todo_item, "checked":false}];
    //     }
    // }
    // showing calender as per month and year given
    show_calender(month = -1, year = -1)
    {
        let first_day;
        let days_in_month;

        // Get starting day of the month
        // Get number of days in the month
        // get month
        // get year
        if (month == -1)
        {
            // let today = new Date();
            // console.log(today);
            year = calender.today_year;
            month = calender.today_month;
            console.log(month, year);
            first_day = new Date(year, month, "1").getDay();
            days_in_month = new Date(year, month + 1, 0).getDate();
        }
        else
        {
            console.log("qqe4t6y", month, year);
            first_day = new Date(year, month, 1).getDay()
            days_in_month = new Date(year, month + 1, 0).getDate();
        }

        console.log(first_day, days_in_month);
        // add dates to the calender
        document.getElementById("month_year").innerText = this.months[month] + " " + Number(year);
        let date_table = document.getElementById('dates');
        date_table.innerHTML = ""
        var row = document.createElement("tr");

        // put empty entries before the starting day of the month
        if (first_day)
        {
            for (let i = 0; i < first_day; i++)
            {
                var date_entry = document.createElement("td");
                row.append(date_entry);
            }
            date_table.appendChild(row);
        }

        // put dates in the month
        for (let i = 1; i <= days_in_month; i++)
        {
            var date_entry = document.createElement("td");
            date_entry.innerHTML += i;
            date_entry.onclick = function()
            {
                show_todo_box(i);
            };
            // mark today
            if (year == calender.today_year && calender.today_month == month && calender.today_date == i)
            {
                date_entry.className = "today";
            }
            row.appendChild(date_entry);

            // check for 7 days in a week
            if ((i + first_day) % 7 == 0)
            {
                date_table.appendChild(row);
                var row = document.createElement("tr");
            }
        }

        // add left elements of the month into the calender if left
        if ((first_day + days_in_month) % 7)
        {
            date_table.appendChild(row);
        }

        // set current month and year 
        this.month = Number(month);
        this.year = Number(year);
    }

}

// MAIN
let calender = new Calender();
if (localStorage.getItem("prev_todolist"))
{
    calender.todolist = JSON.parse(localStorage.getItem("prev_todolist"));
}
calender.show_calender();