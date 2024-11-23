import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { refreshAccount } from 'helpers';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import BigNumber from 'bignumber.js';
import './form.css';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { toBigAmount, toHex, toHexDec, bigToHexDec } from './hex';

const BurnEsdt = () => {
  const [tokenIdentifier, setTokenIdentifier] = React.useState('');
  const [tokenAmount, setTokenAmount] = React.useState(0);
  const [tokenDecimals, setTokenDecimals] = React.useState(0);
  const [bigAmount, setBigAmount] = React.useState(new BigNumber(0));

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

  function handleTokenAmountChange(e: React.ChangeEvent<any>) {
    const amount = e.target.value;
    if (amount < 0) {
      setTokenAmount(0);
      setBigAmount(new BigNumber(0));
    } else {
      setTokenAmount(amount);
      const output = toBigAmount(amount, tokenDecimals);
      setBigAmount(new BigNumber(output));
    }
  }

  function handleTokenDecimalsChange(e: React.ChangeEvent<any>) {
    let dec = e.target.value;
    if (dec <= 0) {
      dec = 0;
    } else if (dec > 18) {
      dec = 18;
    }
    setTokenDecimals(dec);
    const output = toBigAmount(tokenAmount, dec);
    setBigAmount(new BigNumber(output));
  }

  const /*transactionSessionId*/ [, setTransactionSessionId] = useState<
      string | null
    >(null);

  const sendMintTransaction = async () => {
    let txData =
      'ESDTLocalBurn' +
      '@' +
      toHex(tokenIdentifier) +
      '@' +
      bigToHexDec(bigAmount);

    const mintTransaction = {
      value: '0',
      data: txData,
      receiver: address,
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
      <p>ESDTLocalBurn : </p>
      <p>
        <a
          href='https://docs.multiversx.com/tokens/fungible-tokens#burning'
          target='_BLANK'
          rel='noreferrer'
        >
          https://docs.multiversx.com/tokens/fungible-tokens#burning
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

        <div className='form-row'>
          <div className='form-group form-col'>
            <label htmlFor='tokenAmount'>Amount</label>
            <input
              required
              type='number'
              id='tokenAmount'
              placeholder=''
              value={tokenAmount}
              onChange={handleTokenAmountChange}
            />
            {'@' + bigToHexDec(bigAmount)} ({bigAmount.toFixed()})
          </div>
          <div className='form-group form-col'>
            <label htmlFor='tokenDecimals'>
              Decimals (18 max)
              {tokenDecimals > 0 &&
                '(0.' +
                  Math.pow(10, tokenDecimals)
                    .toString()
                    .substring(1, tokenDecimals + 1) +
                  ')'}
            </label>
            <input
              required
              type='number'
              id='tokenDecimals'
              placeholder=''
              value={tokenDecimals}
              onChange={handleTokenDecimalsChange}
            />{' '}
            {'@' + toHexDec(tokenDecimals)}{' '}
          </div>
        </div>
      </form>

      <p>txData : </p>
      <p>To : {address}</p>
      <p>Amount : 0</p>
      <p>Gas : 300000</p>
      <p>
        data :{' '}
        {'ESDTLocalBurn' +
          '@' +
          toHex(tokenIdentifier) +
          '@' +
          bigToHexDec(bigAmount)}
      </p>

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

export default BurnEsdt;
