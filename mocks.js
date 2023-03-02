import fs from 'fs';
import assert from 'node:assert/strict';

/** 
 *  Index of mock XML strings for Sterling testing/development
 *
 *  This module is intended to be run via node.js.
 * 
 *  Doing this, rather than automatically adding all XML files 
 *  in the data directory, gives the author of each mock control
 *  over the index ID (for testing) and the format field. 
*/
const index = [
    {
        id: '0',
        format: 'alloy',
        data: fs.readFileSync('./data/trace0.xml', 'utf-8')
    },
    {
        id: '1',
        format: 'alloy',
        data: fs.readFileSync('./data/trace1.xml', 'utf-8')
    },
    {
        id: '2',
        format: 'alloy',
        data: fs.readFileSync('./data/trace2.xml', 'utf-8')
    },
    {
        id: '3',
        format: 'alloy',
        evaluator: true,
        data: fs.readFileSync('./data/tic_tac_toe/ttt_game.xml', 'utf-8')
    },
    {
        id: '4',
        format: 'alloy',
        evaluator: true,
        data: fs.readFileSync('./data/schedule/schedule1.xml', 'utf-8')
    },
    {
        id: '5',
        format: 'alloy',
        evaluator: true,
        data: fs.readFileSync('./data/schedule/schedule2.xml', 'utf-8')
    },
    {
        id: '6',
        format: 'alloy',
        evaluator: true,
        data: fs.readFileSync('./data/subduction/subductionTest2_1.xml', 'utf-8')
    },
    {
        id: '7',
        format: 'alloy',
        evaluator: true,
        data: fs.readFileSync('./data/subduction/subductionTest2_2.xml', 'utf-8')
    },
]
export default index; 

/**
 * Because the mock index may become large, encode some requirements
 * for well-formedness of the index, so that an error in mock declaration
 * won't result in a confusing error.
 * 
 */
export function validateMockIndex() {
    const ids = [...new Set(index.map(datum => datum.id))]    
    assert.strictEqual(index.length, ids.length, 
        'Datum entries should have distinct id fields')
    
    index.forEach(datum => 
        assert.strict(parseInt(datum.id) >= 0, 
        `Datum entries have integer ID fields >= 0; violated by datum with id: ${datum.id}`))
}