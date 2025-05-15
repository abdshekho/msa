'use client';

import { ProgressProvider } from '@bprogress/next/app';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProgressProvider
            height="3px"
            color="#3f83df"
            options={ { showSpinner: false } }
            shallowRouting
            startPosition={0.3}
        >
            { children }
        </ProgressProvider>
    );
};

export default Providers;