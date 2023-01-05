import React  from 'react';
import '../styles/tabs.scss';

export class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    handleTabClick(tabIndex) {
        this.setState({ selectedTab: tabIndex });
    }

    render() {
        return (
            <div className="tabs">
                <ul className="tabs__list">
                    {this.props.tabTitles.map((title, tabIndex) => (
                        <li
                            key={title}
                            className={"tab-item " + (tabIndex === this.state.selectedTab ? "selected" : "")}
                            onClick={() => this.handleTabClick(tabIndex)}
                        >
                            {title}
                        </li>
                    ))}
                </ul>
                <div className="tabs__content">
                    <div className="tab">
                        {this.props.children[this.state.selectedTab]}
                    </div>
                </div>
            </div>
        );
    }
}