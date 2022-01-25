import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
import { fetch } from 'whatwg-fetch';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class BookSeat extends React.Component {
  state = {
    data: {
      count: 3,
    },
    seats: [],
    seatsSelected: [],
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/seats?count=3`).then(res => {
      if (res.status >= 200 && res.status < 300) {
        res.json().then(res => {
          this.setState({
            seats: res.data.seats,
          });
        });
      }
    });
  }

  onChange = event => {
    this.setState({
      data: { ...this.state.data, [event.target.name]: event.target.value },
    });
    fetch(`${process.env.REACT_APP_API_URL}/seats?count=${event.target.value}`).then(res => {
      if (res.status >= 200 && res.status < 300) {
        res.json().then(res => {
          this.setState({
            seats: res.data.seats,
          });
        });
      }
    });
  };

  addSeat = seatId => {
    if (this.state.seatsSelected.length <= 5) {
      this.setState({ seatsSelected: [...this.state.seatsSelected, seatId], err: null });
    } else {
      this.setState({ err: 'Maximum 5 seats can be booked' });
    }
  };

  removeSeat = seatId => {
    const { seatsSelected } = this.state;
    for (let i = 0; i < seatsSelected.length; i++) {
      if (seatsSelected[i] == seatId) {
        if (i == 0) {
          this.setState({
            seatsSelected: [
              ...seatsSelected.splice(1, i),
              ...seatsSelected.splice(1, seatsSelected.length),
            ],
          });
        } else {
          this.setState({
            seatsSelected: [
              ...seatsSelected.splice(0, i),
              ...seatsSelected.splice(i, seatsSelected.length),
            ],
          });
        }
      }
    }
  };

  fetchContents = () => {
    fetch(`${process.env.REACT_APP_API_URL}/seats?count=${this.state.data.count}`).then(res => {
      if (res.status >= 200 && res.status < 300) {
        res.json().then(res => {
          this.setState({
            seats: res.data.seats,
          });
        });
      }
    });
  };

  submit = e => {
    if (this.state.seatsSelected.length > 0) {
      this.setState({ err: null });
      const seatsSelectedToSend = this.state.seatsSelected.map(seat => seat.id);
      console.log(seatsSelectedToSend);
      fetch(`${process.env.REACT_APP_API_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seatsSelectedToSend), // POST API NOT WOKRING , DATATYPE NOT MATCHING WITH API
      }).then(res => {
        if (res.status >= 200 && res.status < 300) {
          alert('Seats Booked');
          this.fetchContents();
        } else {
          alert('Failed while booking seats!');
        }
      });
    } else {
      this.setState({ err: 'Please select a seat' });
    }
  };

  render() {
    const {
      state: {
        data: { count },
        err,
        seatsSelected,
        seats,
      },
      onChange,
      addSeat,
      removeSeat,
      submit,
    } = this;
    let price = 0;
    return (
      <div>
        <Container>
          <Form>
            <Form.Group className="mb-3" controlId="count">
              <Form.Label>Enter number of rows:</Form.Label>
              <Form.Control
                type="number"
                name="count"
                min="3"
                max="10"
                value={count}
                onChange={onChange}
              />
            </Form.Group>
          </Form>
          <div className="invertedPyramid">
            {seats.map((row, index) => (
              <div className="row" key={index}>
                <span className="rowNumber">{parseInt(row.seats[0].row) + 1}</span>
                {row.seats.map((seat, seatIndex) => {
                  if (seat.isReserved == false) {
                    if (seatsSelected.findIndex(seatSelected => seatSelected == seat) < 0) {
                      return (
                        <div
                          className="seat"
                          key={seatIndex}
                          onClick={() => {
                            addSeat(seat);
                          }}
                        >
                          {seat.seatNumber}
                        </div>
                      );
                    }

                    return (
                      <div
                        className="seat selected"
                        key={seatIndex}
                        onClick={() => {
                          removeSeat(seat.id);
                        }}
                      >
                        {seat.seatNumber}
                      </div>
                    );
                  }

                  return (
                    <div className="seat disabled" key={seatIndex}>
                      {seat.seatNumber}
                    </div>
                  );
                })}
              </div>
            ))}
            )}
          </div>
          {err && <Alert variant="danger">{err}</Alert>}
          {seatsSelected.length > 0 && (
            <>
              {seatsSelected.map((seat, index) => {
                if (index == 0) {
                  price = (parseInt(seat.row) + 1) * 10;
                } else {
                  price += (parseInt(seat.row) + 1) * 10;
                }
              })}
              <Alert variant="primary">
                Total Price: ${typeof price !== 'undefined' && String(price)}
              </Alert>
            </>
          )}
          <Form>
            <Button onClick={submit}>Book Seats</Button>
          </Form>
        </Container>
      </div>
    );
  }
}
