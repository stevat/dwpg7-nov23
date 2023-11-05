import { expect } from 'chai'
// const { createSandbox } = require('sinon')

import TicketService from '../src/pairtest/TicketService.js'

describe('TicketService', () => {
    it('Should return a json object', () => {
        const result = new TicketService();
        expect(result).to.deep.equal({}); 
    })
})

