import React, { Component } from 'react';
import './App.css';
import TaskFrom from './components/TaskFrom';
import TaskControl from './components/TaskControl';
import TaskList from './components/TaskList';
import _ from 'lodash';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isDisplayForm: false, // Đóng mở TaskForm
            taskEditing: null,
            filter: {
                name: '',
                status: -1
            },
            keyword: '',
            sortBy: 'name',
            sortValue: -1
        };
    }

    componentDidMount() {
        if (localStorage && localStorage.getItem('tasks')) {
            var tasks = JSON.parse(localStorage.getItem('tasks'));// Chuyển về dạng object
            this.setState({
                tasks: tasks
            });
        }
    }
    // Lưu dữ liệu trên localStorage
    // onGenrateData = () => {
    //     var tasks = [
    //         {
    //             id: this.generateID(),
    //             name: 'Trường',
    //             status: true
    //         },
    //         {
    //             id: this.generateID(),
    //             name: 'Thanhml',
    //             status: false
    //         },
    //         {
    //             id: this.generateID(),
    //             name: 'Tú',
    //             status: true
    //         }
    //     ];
    //     this.setState({
    //         tasks: tasks
    //     });
    //     // Lưu và local
    //     //localStorage.setItem('tasks', tasks); // Lưu theo dạng object
    //     localStorage.setItem('tasks', JSON.stringify(tasks)); // Lưu dạng String
    // }

    // ============== Tạo ID Random ====================== // 
    s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    generateID() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }
    // =========================================================== //

    // Đóng mở TaskForm
    onToggleForm = () => {
        if (this.state.isDisplayForm && this.state.taskEditing !== null) {
            this.setState({
                isDisplayForm: true,
                taskEditing: null
            })
        } else {
            this.setState({
                isDisplayForm: !this.state.isDisplayForm,
                taskEditing: null
            })
        }

    }
    // Đóng mở TaskForm từ thằng con
    onCloseForm = () => {
        this.setState({
            isDisplayForm: false
        })
    }

    onShowForm = () => {
        this.setState({
            isDisplayForm: true
        })
    }

    // Nhận lại dữ liệu state từ TaskForm từ thằng con
    onSubmit = (data) => {
        var tasks = this.state.tasks;
        if (data.id === '') {
            // Thêm công việc
            data.id = this.generateID();
            tasks.push(data);
        } else {
            // Sửa công việc
            var index = this.findIndex(data.id); // tìm cái index của id
            tasks[index] = data
        }
        this.setState({
            tasks: tasks,
            taskEditing: null
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // =====================Thay đổi trạng thái Status theo ID ====================== //
    onUpdateStatus = (id) => {
        const { tasks } = this.state;
        const newTasks = tasks.map((task, index) => {
            if (task.id === id) {
                task.status = !task.status
            }
            return task;
        })
        this.setState({ tasks: newTasks })
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // ==================  Thay đổi trạng thái Status theo Index ====================== //
    // onUpdateStatus = (id) => {
    //     var tasks = this.state.tasks;
    //     // var index = this.findIndex(id); // tìm cái index của id
    //     var index = _.findIndex(tasks, (task) => { // Sử dụng thư viện lodash
    //         return task.id === id;
    //     })
    //     if (index !== -1) {
    //         tasks[index].status = !tasks[index].status;
    //         this.setState({
    //             tasks: tasks
    //         });
    //         localStorage.setItem('tasks', JSON.stringify(tasks));
    //     }
    // }

    findIndex = (id) => {
        var { tasks } = this.state;
        var result = -1;
        tasks.forEach((tasks, index) => {
            if (tasks.id === id) {
                result = index;
            }
        });
        return result;
    }
    // ======================================================================== //


    // ==================== Xóa nội dung theo ID ================================ //
    onDelete = (id) => {
        var { tasks } = this.state;
        var kqFilter = tasks.filter(task => task.id !== id);
        this.setState({
            tasks: kqFilter
        })
        localStorage.setItem('tasks', JSON.stringify(kqFilter))
        this.onCloseForm();
    }
    // ========================== Xóa theo Index ================================ //
    // onDelete = (id) => {
    //     var tasks = this.state.tasks;

    //     var index = this.findIndex(id); // tìm cái index của id
    //     if (index !== -1) {
    //         tasks.splice(index, 1);
    //         this.setState({
    //             tasks: tasks
    //         });
    //         localStorage.setItem('tasks', JSON.stringify(tasks));
    //     }
    // }
    // ============================================================================== //

    // Sửa dự liệu trong TaskForm
    onUpdate = (id) => {
        var tasks = this.state.tasks;
        var index = this.findIndex(id); // tìm cái index của id
        var taskEditing = tasks[index];
        this.setState({
            taskEditing: taskEditing
        })
        this.onShowForm();
    }

    // ============ Lọc dữ liệu tìm kiếm ================= //
    onFilter = (filterName, filterStatus) => {
        filterStatus = parseInt(filterStatus); // ép từ string -> number
        this.setState({
            filter: {
                name: filterName.toLowerCase(),// Chuyển về chữ thường
                status: filterStatus
            }
        })

    }
    // =================================================== //

    // ========================= Tìm Kiếm Dữ liệu ===================== //
    onSearch = (keyword) => {
        this.setState({
            keyword: keyword
        })
    }
    // =================================================================== //

    // ========================= Sắp xếp dữ liệu nhận về ================ //
    onSort = (sortBy, sortValue) => {
        this.setState({
            sortBy: sortBy,
            sortValue: sortValue
        })
    }
    // ================================================================== //
    render() {

        var { tasks, isDisplayForm, filter, keyword, sortBy, sortValue } = this.state; // Viết tắt của var tasks = this.state.tasks

        // ============================= Lọc dữ liệu =====================//
        if (filter) {
            if (filter.name) {
                tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filter.name) !== -1;
                    // indexOf "Trả về vị trí xuất hiện lần đầu tiên của một giá trị được tìm thấy trong chuỗi"
                })
            }
            tasks = tasks.filter((task) => {
                if (filter.status === -1) {
                    return task;
                } else {
                    return task.status === (filter.status === 1 ? true : false)
                }
            })
        }
        // ============================================================== //
        // ====================== Tìm kiếm dữ liệu ============================== //
        if (keyword) {
            tasks = tasks.filter((task) => {
                return task.name.toLowerCase().indexOf(keyword) !== -1;
                // indexOf "Trả về vị trí xuất hiện lần đầu tiên của một giá trị được tìm thấy trong chuỗi"
            })
        }
        // ====================================================================== //

        // ==================== Sắp xếp dữ liệu =========================== //
        if (sortBy === 'name') {
            tasks.sort((a, b) => {
                if (a.name > b.name) return sortValue;
                else if (a.name < b.name) return -sortValue;
                else return 0;
            })
        } else {
            tasks.sort((a, b) => {
                if (a.status > b.status) return -sortValue;
                else if (a.status < b.status) return sortValue;
                else return 0;
            })
        }
        // =============================================================== //
        var elmTaskForm = isDisplayForm ?
            <TaskFrom
                onSubmit={this.onSubmit}
                onCloseForm={this.onCloseForm}
                task={this.state.taskEditing}
            /> : '';

        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1>
                    <hr />
                </div>
                <div className="row">
                    <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
                        {elmTaskForm}
                    </div>
                    <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.onToggleForm}
                        >
                            <span className="fa fa-plus mr-5"></span>Thêm Công Việc
                        </button>
                        {/* <button
                            type="button"
                            className="btn btn-danger ml-5"
                            onClick={this.onGenrateData}
                        >
                            Genrate Data
                        </button> */}

                        <TaskControl
                            onSearch={this.onSearch}
                            onSort={this.onSort}
                            sortBy={sortBy}
                            sortValue={sortValue}
                        ></TaskControl>

                        <div className="row mt-15">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                <TaskList
                                    tasks={tasks}
                                    onUpdateStatus={this.onUpdateStatus}
                                    onDelete={this.onDelete}
                                    onUpdate={this.onUpdate}
                                    onFilter={this.onFilter}
                                ></TaskList>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default App;
