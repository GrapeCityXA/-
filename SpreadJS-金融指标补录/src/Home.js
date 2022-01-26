import { Component } from "react";
import { getUsers } from "./requests/getUsers";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: "default res",
      error: "default error"
    };
  }

  componentDidMount() {
    const _this = this;
    getUsers().then(
      (res) => {
        console.log("get users response:", res);
        this.setState({res: res})
      },
      (error) => {
        console.log("get response failed!", _this.error = error);
        this.setState({error: error})
      }
    );
  }

  render() {
    return <h2>
      Users: {this.state.res[0].name}
    </h2>
  }
}

export default Home;