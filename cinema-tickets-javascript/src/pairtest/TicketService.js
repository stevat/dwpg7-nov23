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
      throw new InvalidPurchaseException(accountId + " should be greater than 0");
    }
    if (!Number.isInteger(accountId)) {
      throw new InvalidPurchaseException(accountId + " should be numeric");
    }
    console.log("Account ID: "+accountId+" is legitimate");
    return true;
  };

  #isLegitimateNoOfTickets = (...ticketTypeRequests) => {
    let aggregateTickets = 0;
    for (const request of ticketTypeRequests) {
      aggregateTickets += request.getNoOfTickets();
    }
    if (aggregateTickets < 21) {
      console.log(aggregateTickets+" confirmed as number of tickets requested")
    } else {
      throw new InvalidPurchaseException("Aggregated tickets ("+aggregateTickets+") should be between "+constants.MINIMUM_NO_OF_TICKETS+" and "+constants.MAXIMUM_NO_OF_TICKETS);
    }
  };

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    this.#isLegitimateAccountId(accountId);
    this.#isLegitimateNoOfTickets(...ticketTypeRequests)
    console.log("legit account id passed")

    return {}
  }
}
