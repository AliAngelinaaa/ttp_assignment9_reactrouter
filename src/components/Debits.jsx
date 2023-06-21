import React, { Component } from "react";

class Debits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debits: [],
      showForm: false,
      description: "",
      amount: 0
    };
    this.toggleForm = this.toggleForm.bind(this);
  }

    toggleForm() {
        this.setState((prevState) => ({
            showForm: !prevState.showForm
        }));
    }

    componentDidMount() {
        this.fetchDebits();
    }

    fetchDebits = async () => {
        try {
            const apiUrl =
                "https://bank-of-react-b745wfs0u-ajlapid718.vercel.app/debits";
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                this.setState({
                    debits: data
                });
            }
        } catch (error) {
            console.error("Error fetching debits:", error);
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleAddTransaction = (event) => {
        event.preventDefault();
      
        const { description, amount, debits } = this.state;
      
        const newDebit = {
          description,
          amount: parseFloat(amount),
          date: new Date().toISOString()
        };
      
        const updatedDebits = [...debits, newDebit];
        const debitsTotal = this.calculateDebitsTotal(updatedDebits);
        const updatedAccountBalance = this.props.accountBalance - debitsTotal;
      
        this.setState({
          debits: updatedDebits,
          description: "",
          amount: 0
        });
      
        // Call the updateAccountBalance function passed from App.js
        this.props.updateAccountBalance(updatedAccountBalance);
      };
      

    calculateDebitsTotal = (debits) => {
        return debits.reduce((total, debit) => total + debit.amount, 0);
    };

    render() {
        const { debits, showForm, description, amount } = this.state;

        return (
            <div>
                <h1>Your Debit Account</h1>
                <h2>Account Balance: ${this.props.accountBalance}</h2> 
                {showForm ? (
                    <form>
                        <label htmlFor="description">Description: </label>
                        <input
                            type="text"
                            name="description"
                            value={description}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="description">Amount: </label>
                        <input
                            type="number"
                            name="amount"
                            value={amount}
                            onChange={this.handleInputChange}
                        />

                        <button onClick={this.handleAddTransaction}>Add Debits</button>
                    </form>
                ) : (
                    <button onClick={this.toggleForm}>Add Transaction</button>
                )}
                <div>
                    {debits.map((debit, index) => (
                        <div key={index}>
                            <p>Description: {debit.description}</p>
                            <p>Amount: ${debit.amount}</p>
                            <p>Date: {debit.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Debits;
