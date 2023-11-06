// import { expect } from 'chai';
import {expect, jest, test} from '@jest/globals';
// import { jest } from "@jest/globals";
// import pkg from '@jest/globals';
// const { jest } = pkg;

import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
import TicketService from '../src/pairtest/TicketService.js';

// const TicketPaymentService = sinon.spy(TicketService, 'TicketPaymentService');
// let SeatReservationService = sinon.spy(TicketService, 'SeatReservationService');
// const makePayment = jest
//   .spyOn(TicketPaymentService.prototype, "makePayment")

// const reserveSeat = jest
//   .spyOn(SeatReservationService.prototype, "reserveSeat")

describe('TicketService', () => {
  const ticketService = new TicketService();

  beforeEach(() => {
    jest.resetAllMocks();
    
  });

  it('Should return a json object', () => {
    console.log("****** Point A ")
    expect(ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1))).toEqual({})
  });

  it('Should have a numeric account ID', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        "Jeff",
        new TicketTypeRequest("ADULT", 1)
      );
    }
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError("Jeff should be numeric");
  })

  it('Should have a greater than 0 numeric account ID', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        0,
        new TicketTypeRequest("ADULT", 1)
      );
    }
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError("0 should be greater than 0");
  })

  it('Should handle multiple ticket bookings', () => {
    const output = new TicketService();
    expect(output).to.deep.equal({}); 
  })

  it('Should not exceed the maximum number of ticket bookings', () => {
    const output = new TicketService();
    expect(output).to.deep.equal({}); 
  })

  it('Should have at least the minimum number of ticket bookings', () => {
    const output = new TicketService();
    expect(output).to.deep.equal({}); 
  })

  it('Should not allow child or infant tickets to be booked without an adult', () => {
    const output = new TicketService();
    expect(output).to.deep.equal({}); 
  })

  it('Should issue a ticket but not book a seat for an infant', () => {
    const output = new TicketService();
    expect(output).to.deep.equal({}); 
  })

  it('Should charge the correct fare for an adult ticket', () => {
    const output = new TicketService();
    // const makePayment = jest
    //   .spyOn(TicketPaymentService.prototype, "makePayment")
    expect(output).to.deep.equal({}); 
  })

  it('Should charge the correct fare for a child ticket', () => {
    const output = new TicketService();
    // const makePayment = jest
    //   .spyOn(TicketPaymentService.prototype, "makePayment")
    expect(output).to.deep.equal({}); 
  })

  it('Should not charge for an infant', () => {
    const output = new TicketService();
    // const makePayment = jest
    //   .spyOn(TicketPaymentService.prototype, "makePayment")
    expect(output).to.deep.equal({}); 
  })

  it('Should call the TicketPaymentService with the correct aggregate charge', () => {
    const output = new TicketService();
    // const makePayment = jest
    //   .spyOn(TicketPaymentService.prototype, "makePayment")
    expect(output).to.deep.equal({}); 
  })

  it('Should call the SeatReservationService with the correct no of seats to reserve', () => {
    const output = new TicketService();
    expect(output).to.deep.equal({}); 
  })

})

