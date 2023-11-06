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
      if (request.getTicketType == 'ADULT') {
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
      if (request.getTicketType == 'ADULT') {
        adultCount += 1;
      } else if (request.getTicketType == 'INFANT') {
        infantCount += 1;
      }
    }
    if (adultCount >= infantCount) {
      console.log('Adults outnumber infants')
    } else {
      throw new InvalidPurchaseException('Account ID: '+accountId+' - Adults must outnumber infants');
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    this.#isLegitimateAccountId(accountId);
    this.#isLegitimateNoOfTickets(accountId, ...ticketTypeRequests);
    this.#adultsPresent(accountId, ...ticketTypeRequests);
    this.#adultsOutnumberInfants(accountId, ...ticketTypeRequests);
    console.log("legit account id passed");

    return {}
  }
}
