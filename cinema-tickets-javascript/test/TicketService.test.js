import {expect, jest, test} from '@jest/globals';
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
import TicketService from '../src/pairtest/TicketService.js';
import { constants } from '../src/pairtest/constants.js';


describe('TicketService', () => {
  const ticketService = new TicketService();

  beforeEach(() => {
    jest.resetAllMocks();
    
  });

  it('Should return a json object', () => {
    expect(ticketService.purchaseTickets(1, new TicketTypeRequest('ADULT', 1))).toEqual({ messsage: 'transaction completed' })
  });

  it('Should have a numeric account ID', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        'Jeff',
        new TicketTypeRequest('ADULT', 1)
      );
    };
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError('Jeff should be numeric');
  })

  it('Should have a greater than 0 numeric account ID', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        0,
        new TicketTypeRequest('ADULT', 1)
      );
    };
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError('0 should be greater than 0');
  })

  it('Should handle multiple ticket bookings', () => {
    const output = ticketService.purchaseTickets(
      15,
      new TicketTypeRequest('ADULT', 5)
    );
    expect(output).toEqual({ messsage: 'transaction completed' })

  })

  it('Should not exceed the maximum number of ticket bookings', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        15,
        new TicketTypeRequest('ADULT', 21)
      );
    };
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError('Aggregated tickets (21) should be between '+constants.MINIMUM_NO_OF_TICKETS+' and '+constants.MAXIMUM_NO_OF_TICKETS);

    const outputTwo = () => {
      ticketService.purchaseTickets(
        16,
        new TicketTypeRequest('ADULT', 4),
        new TicketTypeRequest('CHILD', 8),
        new TicketTypeRequest('INFANT', 11),
      );
    };
    expect(outputTwo).toThrow(InvalidPurchaseException); 
    expect(outputTwo).toThrowError('Aggregated tickets (23) should be between '+constants.MINIMUM_NO_OF_TICKETS+' and '+constants.MAXIMUM_NO_OF_TICKETS);
  })

  it('Should have at least the minimum number of ticket bookings', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        17,
        new TicketTypeRequest('ADULT', 0)
      );
    };
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError('Aggregated tickets (0) should be between '+constants.MINIMUM_NO_OF_TICKETS+' and '+constants.MAXIMUM_NO_OF_TICKETS);
  })

  it('Should not allow child or infant tickets to be booked without an adult', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        18,
        new TicketTypeRequest('CHILD', 2),
        new TicketTypeRequest('INFANT', 2)
      );
    };
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError('At least 1 adult must be present');
  })

  it('Should not allow more infant tickets to be booked than adults', () => {
    const outputOne = () => {
      ticketService.purchaseTickets(
        19,
        new TicketTypeRequest('INFANT', 3),
        new TicketTypeRequest('ADULT', 1)
      );
    };
    expect(outputOne).toThrow(InvalidPurchaseException); 
    expect(outputOne).toThrowError('Account ID: 19 - Adults must outnumber infants');

    const outputTwo = 
      ticketService.purchaseTickets(
        20,
        new TicketTypeRequest('ADULT', 1),
        new TicketTypeRequest('INFANT', 1)
      );
    expect(outputTwo).toEqual({ messsage: 'transaction completed' });
  })

  it('Should issue a ticket but not book a seat for an infant', () => {
    const reserveSeat = jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
      .mockImplementation(() => {
        console.log('reserveSeat mock call');
      });
    ticketService.purchaseTickets(
      21,
      new TicketTypeRequest('ADULT', 2),
      new TicketTypeRequest('INFANT', 1)
    );
    expect(reserveSeat).toHaveBeenCalledTimes(1);
    expect(reserveSeat).toHaveBeenCalledWith(21, 2);
  })

  it('Should charge the correct fare for an adult ticket', () => {
    const makePaymentSpy = jest
      .spyOn(TicketPaymentService.prototype, "makePayment")
      .mockImplementation(() => {
        console.log("mock payment spy");
      });
    ticketService.purchaseTickets(
      22,
      new TicketTypeRequest('ADULT', 1)
    );
    expect(makePaymentSpy).toHaveBeenCalledTimes(1);
    expect(makePaymentSpy).toHaveBeenCalledWith(22, 20);
  })

  it('Should charge the correct fare for a child ticket', () => {
    const makePayment = jest
      .spyOn(TicketPaymentService.prototype, "makePayment")
      .mockImplementation(() => {
        console.log("mock payment spy");
      });
    ticketService.purchaseTickets(
      23,
      new TicketTypeRequest('CHILD', 1),
      new TicketTypeRequest('ADULT', 2),
    );
    expect(makePayment).toHaveBeenCalledTimes(1);
    expect(makePayment).toHaveBeenCalledWith(23, 50);
  })

  it('Should not charge for an infant', () => {
    const makePayment = jest
      .spyOn(TicketPaymentService.prototype, 'makePayment')
      .mockImplementation(() => {
        console.log("makePayment Mock call");
      });
    ticketService.purchaseTickets(
      24,
      new TicketTypeRequest('INFANT', 1),
      new TicketTypeRequest('ADULT', 1)
    );
    expect(makePayment).toHaveBeenCalledTimes(1);
    expect(makePayment).toHaveBeenCalledWith(24, 20);
  })
 
  it('Should call the TicketPaymentService with the correct aggregate charge', () => {
    const makePayment = jest
      .spyOn(TicketPaymentService.prototype, 'makePayment')
      .mockImplementation(() => {
        console.log("makePayment Mock call");
      });
    ticketService.purchaseTickets(
      25,
      new TicketTypeRequest('INFANT', 1),
      new TicketTypeRequest('ADULT', 10),
      new TicketTypeRequest('CHILD', 2)
    );
    expect(makePayment).toHaveBeenCalledTimes(1);
    expect(makePayment).toHaveBeenCalledWith(25, 220);
  })

  it('Should call the SeatReservationService with the correct no of seats to reserve', () => {
    const reserveSeat = jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
      .mockImplementation(() => {
        console.log('reserveSeat mock call');
      });
    ticketService.purchaseTickets(
      26,
      new TicketTypeRequest('ADULT', 5),
      new TicketTypeRequest('CHILD', 3),
      new TicketTypeRequest('INFANT', 1)
    );
    expect(reserveSeat).toHaveBeenCalledTimes(1);
    expect(reserveSeat).toHaveBeenCalledWith(26, 8);
  })

})

