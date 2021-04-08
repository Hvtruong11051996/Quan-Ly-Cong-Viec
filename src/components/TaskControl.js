import React, { Component } from 'react';
import TaskSeachControl from './TaskSeachControl';
import TaskSortControl from './TaskSortControl';

class TaskControl extends Component {
    render() {
        return (
            <div className="row mt-15">
                <TaskSeachControl onSearch={this.props.onSearch}></TaskSeachControl>

                <TaskSortControl
                    onSort={this.props.onSort}
                    sortBy={this.props.sortBy}
                    sortValue={this.props.sortValue}
                ></TaskSortControl>
            </div>
        );
    };
}

export default TaskControl;
