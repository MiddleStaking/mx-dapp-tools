import { AuthRedirectWrapper } from 'wrappers';
import IssueEsdt from './components/issueEsdt';
import MintEsdt from './components/mintEsdt';
import BurnEsdt from './components/burnEsdt';
import PauseEsdt from './components/pauseEsdt';
import UnpauseEsdt from './components/unpauseEsdt';
export const Tokens = () => {
  return (
    <AuthRedirectWrapper>
      <div className='flex flex-col gap-6 max-w-3xl w-full'>
        <IssueEsdt />
        <MintEsdt />
        <BurnEsdt />
        <PauseEsdt />
        <UnpauseEsdt />
      </div>
    </AuthRedirectWrapper>
  );
};
