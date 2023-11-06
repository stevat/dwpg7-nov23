import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #isLegitimateAccountId = (accountId) => {
    if (accountId <=0) {
      throw new InvalidPurchaseException(accountId + " should be greater than 0")
    }
    if (!Number.isInteger(accountId)) {
      throw new InvalidPurchaseException(accountId + " should be numeric")
    }
    console.log("Account ID: "+accountId+" is legitimate")
    return true
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    this.#isLegitimateAccountId(accountId);
    console.log("legit account id passed")

    return {}
  }
}
