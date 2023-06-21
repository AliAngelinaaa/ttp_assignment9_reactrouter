import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import Debits from "./components/Debits";
import Credits from "./components/Credits";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      debits: [],
      credits: []
    };
  }

  componentDidMount() {
    this.fetchDebits();
    this.fetchCredits();
  }

  fetchDebits = async () => {
    try {
      const apiUrl = "https://bank-of-react-b745wfs0u-ajlapid718.vercel.app/debits";
      const response = await fetch(apiUrl);
      const debitsData = await response.json();
  
      if (Array.isArray(debitsData) && debitsData.length > 0) {
        const debitsTotal = debitsData.reduce((total, debit) => total + debit.amount, 0);
        const updatedBalance = this.state.accountBalance - debitsTotal;
        this.setState({ debits: debitsData, accountBalance: updatedBalance });
      }
    } catch (error) {
      console.error("Error fetching debits:", error);
    }
  };
  
  fetchCredits = async () => {
    try {
      const apiUrl = "https://bank-of-react-b745wfs0u-ajlapid718.vercel.app/credits";
      const response = await fetch(apiUrl);
      const creditsData = await response.json();
  
      if (Array.isArray(creditsData) && creditsData.length > 0) {
        const creditsTotal = creditsData.reduce((total, credit) => total + credit.amount, 0);
        const updatedBalance = this.state.accountBalance + creditsTotal;
        this.setState({ credits: creditsData, accountBalance: updatedBalance });
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };
  
  updateAccountBalance = (newBalance) => {
    this.setState({ accountBalance: newBalance });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <header>
            <nav className="navbar">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/userProfile" className="nav-link">
                    User Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/debits" className="nav-link">
                    Debits
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/credits" className="nav-link">
                    Credits
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/userProfile/*" element={<UserProfile />} />
            <Route
              path="/debits/*"
              element={<Debits accountBalance={this.state.accountBalance} updateAccountBalance={this.updateAccountBalance}/>}
            />
            <Route
              path="/credits/*"
              element={<Credits accountBalance={this.state.accountBalance} updateAccountBalance={this.updateAccountBalance}/>}
            />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
