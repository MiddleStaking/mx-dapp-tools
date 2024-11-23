import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { refreshAccount } from 'helpers';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import BigNumber from 'bignumber.js';
import './form.css';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { toBigAmount, toHex, toHexDec, bigToHexDec } from './hex';

const UnpauseEsdt = () => {
  const [tokenIdentifier, setTokenIdentifier] = React.useState('');

  const { address } = useGetAccountInfo();

  /*
    Token Name : 3-20 [a-zA-Z0-9]
    Token ticker :    3-10 [A-Z0-9]
    Amount to issue : [0-9]
    Decimals : 18[0-9]
    */

  function handleTokenIdentifierChange(e: React.ChangeEvent<any>) {
    setTokenIdentifier(e.target.value);
  }

  const /*transactionSessionId*/ [, setTransactionSessionId] = useState<
      string | null
    >(null);

  const sendMintTransaction = async () => {
    let txData = 'unPause' + '@' + toHex(tokenIdentifier);

    const mintTransaction = {
      value: '0',
      data: txData,
      receiver:
        'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u',
      gasLimit: '300000'
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: mintTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing mint transaction',
        errorMessage: 'An error has occured mint',
        successMessage: 'Mint transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  return (
    <div className='container py-4'>
      <p>ESDTUnpause : </p>
      <p>
        <a
          href='https://docs.multiversx.com/tokens/fungible-tokens#pausing-and-unpausing'
          target='_BLANK'
          rel='noreferrer'
        >
          https://docs.multiversx.com/tokens/fungible-tokens#pausing-and-unpausing
        </a>
      </p>
      <br />
      <form>
        <div className='form-row'>
          <div className='form-group form-col'>
            <label htmlFor='tokenIdentifier'>Identifier</label>
            <input
              required
              type='text'
              id='tokenIdentifier'
              placeholder=''
              value={tokenIdentifier}
              onChange={handleTokenIdentifierChange}
            />
            {tokenIdentifier && '@' + toHex(tokenIdentifier)}
          </div>
        </div>
      </form>

      <p>txData : </p>
      <p>To : erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u</p>
      <p>Amount : 0</p>
      <p>Gas : 300000</p>
      <p>data : {'unPause' + '@' + toHex(tokenIdentifier)}</p>

      <div className='form-row'>
        <div className='form-group form-col'>
          <button
            type='button'
            className='send-button'
            onClick={sendMintTransaction}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnpauseEsdt;
