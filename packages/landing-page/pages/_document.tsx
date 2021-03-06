import Document, { DocumentContext, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { resolveStaticPath } from '@suite-utils/nextjs';
import { ServerStyleSheet } from 'styled-components';
import globalStyles from '../support/styles';

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props =>
                        sheet.collectStyles(
                            <>
                                <App {...props} />
                            </>,
                        ),
                });
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                        {/* eslint-disable-next-line react/no-danger */}
                        <style dangerouslySetInnerHTML={{ __html: globalStyles }} key="styles" />
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <html lang="en" style={{ height: '100%' }}>
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta httpEquiv="Pragma" content="no-cache" />
                    <meta httpEquiv="cache-control" content="no-cache" />
                    <meta httpEquiv="expires" content="-1" />
                    <link
                        media="all"
                        rel="stylesheet"
                        href={resolveStaticPath('fonts/fonts.css')}
                    />
                </Head>
                <body style={{ height: '100%' }}>
                    <title>Trezor Beta Wallet</title>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
