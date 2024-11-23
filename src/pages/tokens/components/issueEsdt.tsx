import * as React from 'react';
import { toBigAmount, toHex, toHexDec, bigToHexDec } from './hex';
import { useState } from 'react';
import { refreshAccount } from 'helpers';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import BigNumber from 'bignumber.js';
import './form.css';

const IssueEsdt = () => {
  const [formControl, setFormControl] = React.useState('');

  const [tokenName, setTokenName] = React.useState('');
  const [tokenTicker, setTokenTicker] = React.useState('');
  const [tokenAmount, setTokenAmount] = React.useState(0);
  const [tokenDecimals, setTokenDecimals] = React.useState(0);
  const [bigAmount, setBigAmount] = React.useState(new BigNumber(0));

  const [canUpgrade, setCanUpgrade] = React.useState(true);
  const [canFreeze, setCanFreeze] = React.useState(false);
  const [canWipe, setCanWipe] = React.useState(false);
  const [canPause, setCanPause] = React.useState(false);
  const [canMint, setCanMint] = React.useState(false);
  const [canBurn, setCanBurn] = React.useState(false);
  const [canChangeOwner, setCanChangeOwner] = React.useState(false);
  const [canAddSpecialRoles, setCanAddSpecialRoles] = React.useState(true);

  /*
    Token Name : 3-20 [a-zA-Z0-9]
    Token ticker :    3-10 [A-Z0-9]
    Amount to issue : [0-9]
    Decimals : 18[0-9]
    */

  function handleTokenNameChange(e: React.ChangeEvent<any>) {
    setTokenName(e.target.value);
  }
  function handleTokenTickerChange(e: React.ChangeEvent<any>) {
    setTokenTicker(e.target.value.toUpperCase());
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

  function handleCanUpgrade() {
    setCanUpgrade(!canUpgrade);
  }
  function handleCanFreeze() {
    setCanFreeze(!canFreeze);
  }
  function handleCanWipe() {
    setCanWipe(!canWipe);
  }
  function handleCanPause() {
    setCanPause(!canPause);
  }
  function handleCanMint() {
    setCanMint(!canMint);
  }
  function handleCanBurn() {
    setCanBurn(!canBurn);
  }
  function handleCanChangeOwner() {
    setCanChangeOwner(!canChangeOwner);
  }
  function handleCanAddSpecialRoles() {
    setCanAddSpecialRoles(!canAddSpecialRoles);
  }

  function handleSubmit() {
    if (tokenName.length < 3 || tokenName.length > 20) {
      setFormControl('Token Name invalid length');
    } else if (!/^[a-zA-Z0-9]+$/g.test(tokenName)) {
      setFormControl('Token Name invalid value [a-zA-Z0-9]');
    } else if (tokenTicker.length < 3 || tokenTicker.length > 10) {
      setFormControl('Token Ticker invalid length');
    } else if (!/^[A-Z0-9]+$/g.test(tokenTicker)) {
      setFormControl('Token Ticker invalid value [A-Z0-9]');
    } else {
      setFormControl('');
      sendIssueTransaction();
    }
  }

  const /*transactionSessionId*/ [, setTransactionSessionId] = useState<
      string | null
    >(null);

  const sendIssueTransaction = async () => {
    let txData =
      'issue' +
      '@' +
      toHex(tokenName) +
      '@' +
      toHex(tokenTicker) +
      '@' +
      bigToHexDec(bigAmount) +
      '@' +
      toHexDec(tokenDecimals);

    if (canFreeze) {
      txData =
        txData + '@' + toHex('canFreeze') + '@' + toHex(canFreeze.toString());
    }
    if (canWipe) {
      txData =
        txData + '@' + toHex('canWipe') + '@' + toHex(canWipe.toString());
    }
    if (canPause) {
      txData =
        txData + '@' + toHex('canPause') + '@' + toHex(canPause.toString());
    }
    if (canMint) {
      txData =
        txData + '@' + toHex('canMint') + '@' + toHex(canMint.toString());
    }
    if (canBurn) {
      txData =
        txData + '@' + toHex('canBurn') + '@' + toHex(canBurn.toString());
    }
    if (canChangeOwner) {
      txData =
        txData +
        '@' +
        toHex('canChangeOwner') +
        '@' +
        toHex(canChangeOwner.toString());
    }
    //canUpgrade is always true by default
    if (!canUpgrade) {
      txData =
        txData + '@' + toHex('canUpgrade') + '@' + toHex(canUpgrade.toString());
    }
    //canAddSpecialRoles is always false by default
    if (!canAddSpecialRoles) {
      txData =
        txData +
        '@' +
        toHex('canAddSpecialRoles') +
        '@' +
        toHex(canAddSpecialRoles.toString());
    }

    const issueTransaction = {
      value: '50000000000000000', // (0.05 EGLD)
      data: txData,
      receiver:
        'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u',
      gasLimit: '60000000'
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: issueTransaction,
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
      <p>ESDTIssue: </p>
      <p>
        <a
          href='https://docs.multiversx.com/tokens/nft-tokens/#issuance-of-non-fungible-tokens'
          target='_BLANK'
          rel='noreferrer'
        >
          https://docs.multiversx.com/tokens/nft-tokens/#issuance-of-non-fungible-tokens
        </a>
      </p>
      <br />
      <form>
        <div className='form-row'>
          <div className='form-group form-col'>
            <label htmlFor='tokenName'>Name 3-20 [a-zA-Z0-9]</label>
            <input
              required
              type='text'
              id='tokenName'
              placeholder=''
              value={tokenName}
              onChange={handleTokenNameChange}
            />
            {tokenName && '@' + toHex(tokenName)}
          </div>
          <div className='form-group form-col'>
            <label htmlFor='tokenTicker'>Ticker 3-10 [A-Z0-9]</label>
            <input
              required
              type='text'
              id='tokenTicker'
              placeholder=''
              value={tokenTicker}
              onChange={handleTokenTickerChange}
            />{' '}
            {tokenTicker && '@' + toHex(tokenTicker)}
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

        <div className='form-row'>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canFreeze'
              checked={canFreeze}
              onChange={handleCanFreeze}
            />
            <label htmlFor='canFreeze'>canFreeze</label>{' '}
          </div>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canWipe'
              checked={canWipe}
              onChange={handleCanWipe}
            />
            <label htmlFor='canWipe'>canWipe</label>
          </div>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canPause'
              checked={canPause}
              onChange={handleCanPause}
            />
            <label htmlFor='canPause'>canPause</label>
          </div>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canMint'
              checked={canMint}
              onChange={handleCanMint}
            />
            <label htmlFor='canMint'>canMint</label>
          </div>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canBurn'
              checked={canBurn}
              onChange={handleCanBurn}
            />
            <label htmlFor='canBurn'>canBurn</label>
          </div>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canChangeOwner'
              checked={canChangeOwner}
              onChange={handleCanChangeOwner}
            />
            <label htmlFor='canChangeOwner'>canChangeOwner</label>
          </div>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canUpgrade'
              checked={canUpgrade}
              onChange={handleCanUpgrade}
            />
            <label htmlFor='canUpgrade'>canUpgrade</label>
          </div>
          <div className='checkbox-group form-col'>
            <input
              type='checkbox'
              id='canAddSpecialRoles'
              checked={canAddSpecialRoles}
              onChange={handleCanAddSpecialRoles}
            />
            <label htmlFor='canAddSpecialRoles'>canAddSpecialRoles</label>
          </div>
        </div>
      </form>

      {formControl && (
        <div className='alert alert-warning' role='alert'>
          {formControl}
        </div>
      )}
      <p>txData : </p>
      <p>To : erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u</p>
      <p>Amount : 0.05</p>
      <p>Gas : 60000000</p>
      <p>
        data :{' '}
        {'issue' +
          '@' +
          toHex(tokenName) +
          '@' +
          toHex(tokenTicker) +
          '@' +
          bigToHexDec(bigAmount) +
          '@' +
          toHexDec(tokenDecimals)}
        {canFreeze &&
          '@' + toHex('canFreeze') + '@' + toHex(canFreeze.toString())}
        {canWipe && '@' + toHex('canWipe') + '@' + toHex(canWipe.toString())}
        {canPause && '@' + toHex('canPause') + '@' + toHex(canPause.toString())}
        {canMint && '@' + toHex('canMint') + '@' + toHex(canMint.toString())}
        {canBurn && '@' + toHex('canBurn') + '@' + toHex(canBurn.toString())}
        {canChangeOwner &&
          '@' +
            toHex('canChangeOwner') +
            '@' +
            toHex(canChangeOwner.toString())}
        {!canUpgrade &&
          '@' + toHex('canUpgrade') + '@' + toHex(canUpgrade.toString())}
        {!canAddSpecialRoles &&
          '@' +
            toHex('canAddSpecialRoles') +
            '@' +
            toHex(canAddSpecialRoles.toString())}
      </p>

      <div className='form-row'>
        <div className='form-group form-col'>
          <button type='button' className='send-button' onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueEsdt;
