import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import { emailTailwindConfig } from "./tailwind";

export function VerifyEmailEmail({ url }: { url: string }) {
    return (
        <Tailwind config={emailTailwindConfig}>
            <Html>
                <Head />
                <Preview>Verify your email address</Preview>
                <Body className="bg-background text-foreground font-sans">
                    <Container className="mx-auto my-10 rounded-lg border border-border bg-card p-5 text-card-foreground">
                        <Heading className="mb-4 text-2xl">
                            Verify Your Email Address
                        </Heading>
                        <Text className="mb-4">
                            We received a request to verify your email address.
                            Click the button below to verify it.
                        </Text>
                        <Section className="text-center">
                            <Button
                                href={url}
                                className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
                            >
                                Verify Email
                            </Button>
                        </Section>
                        <Text className="mt-4 text-sm text-muted-foreground">
                            If you did not request a email verification, please
                            ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}

export default function VerifyEmailMock() {
    return <VerifyEmailEmail url="https://example.com/verify-email" />;
}
