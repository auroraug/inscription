// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BatchMint {
    // example : _count: 100 , _data: data:,{"p":"prc-20","op":"mint","tick":"pols","amt":"100000000"}
    function mint(uint256 _count,string memory _data) public {
        bytes memory inscription = bytes(_data);
        uint size = inscription.length;
        address receiver = msg.sender;
        assembly {
            let ptr := add(inscription, 0x20)
            for { let i := 0 } lt(i, _count) { i := add(i, 1) } {
                pop(call(gas(), receiver, 0, ptr, size, 0, 0))
            }
        }
    }
}
