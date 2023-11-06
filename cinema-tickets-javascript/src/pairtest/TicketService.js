import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import { constants } from './constants.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #isLegitimateAccountId = (accountId) => {
    if (accountId <=0) {
      throw new InvalidPurchaseException(accountId + ' should be greater than 0');
    }
    if (!Number.isInteger(accountId)) {
      throw new InvalidPurchaseException(accountId + ' should be numeric');
    }
    console.log('Account ID: '+accountId+' is legitimate');
    return true;
  };

  #isLegitimateNoOfTickets = (accountId, ...ticketTypeRequests) => {
    let aggregateTickets = 0;
    for (const request of ticketTypeRequests) {
      aggregateTickets += request.getNoOfTickets();
    }
    if (aggregateTickets < 21 && aggregateTickets > 0) {
      console.log(aggregateTickets+' confirmed as number of tickets requested for accountID '+accountId)
    } else {
      throw new InvalidPurchaseException('Account ID '+accountId+': Aggregated tickets ('+aggregateTickets+') should be between '+constants.MINIMUM_NO_OF_TICKETS+' and '+constants.MAXIMUM_NO_OF_TICKETS);
    }
  };

  #adultsPresent = (accountId, ...ticketTypeRequests) => {
    let adultPresent = false;
    for (const request of ticketTypeRequests) {
      if (request.getTicketType() == 'ADULT') {
        adultPresent = true;
        break;
      }
    }
    if (adultPresent) {
      console.log('Adult present on booking for Account ID: '+accountId)
    } else {
      throw new InvalidPurchaseException('Account ID: '+accountId+' - At least 1 adult must be present');
    }
  }

  #adultsOutnumberInfants = (accountId, ...ticketTypeRequests) => {
    let adultCount = 0;
    let infantCount = 0;
    for (const request of ticketTypeRequests) {
      if (request.getTicketType() == 'ADULT') {
        adultCount+=request.getNoOfTickets();
        continue;
      } else if (request.getTicketType() == 'INFANT') {
        infantCount+=request.getNoOfTickets();
        continue;
      }
    }
    if (adultCount >= infantCount) {
      console.log('Adults outnumber infants')
    } else {
      throw new InvalidPurchaseException('Account ID: '+accountId+' - Adults must outnumber infants');
    }
  }

  #calculateAggregatePaymentAndResCount = (...ticketTypeRequests) => {
    let noOfAdults = 0;
    let noOfChildren = 0;
    let noOfInfants = 0;
    for (const request of ticketTypeRequests) {
      switch(request.getTicketType()){
        case 'ADULT':
          noOfAdults+=request.getNoOfTickets();
          continue;
        case 'CHILD':
          noOfChildren+=request.getNoOfTickets();
          continue;
        case 'INFANT':
          noOfInfants+=request.getNoOfTickets();
          continue;
      }
    }
    console.log(' - ADULTS: ', noOfAdults, ' - CHILDREN: ', noOfChildren, ' - INFANTS: ', noOfInfants);
    const resCount = noOfAdults + noOfChildren;
    const ticketCount = noOfAdults + noOfChildren + noOfInfants;
    const paymentAmount = (noOfAdults * constants.TICKET_COST.ADULT) + (noOfChildren * constants.TICKET_COST.CHILD);

    console.log('resCount = ', resCount);
    console.log('ticketCount = ', ticketCount);
    console.log('paymentAmount = ', paymentAmount);

    return {
      'resCount': resCount,
      'ticketCount': ticketCount,
      'paymentAmount': paymentAmount
    }
  }

  #takePayment = (accountId, calculations) => {
    const ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId, calculations.paymentAmount);
  }

  #reserveTickets = (accountId, calculations) => {
    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, calculations.resCount);
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    this.#isLegitimateAccountId(accountId);
    this.#isLegitimateNoOfTickets(accountId, ...ticketTypeRequests);
    this.#adultsPresent(accountId, ...ticketTypeRequests);
    this.#adultsOutnumberInfants(accountId, ...ticketTypeRequests);

    console.log('calculating...')
    const calculations = this.#calculateAggregatePaymentAndResCount(...ticketTypeRequests);
    console.log('Account ID ', accountId, ' resCount: ', calculations.resCount, ' payment value: ', calculations.paymentAmount);
    this.#takePayment(accountId, calculations);
    this.#reserveTickets(accountId, calculations);

    console.log('Account ID: ', accountId, ' - Tickets ordered and paid for');

    return { messsage: 'transaction completed' };
  }
}
