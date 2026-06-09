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

export function PasswordResetEmail({ url }: { url: string }) {
    return (
        <Tailwind config={emailTailwindConfig}>
            <Html>
                <Head />
                <Preview>Reset your password</Preview>
                <Body className="bg-background text-foreground font-sans">
                    <Container className="mx-auto my-10 rounded-lg border border-border bg-card p-5 text-card-foreground">
                        <Heading className="mb-4 text-2xl">
                            Reset Your Password
                        </Heading>
                        <Text className="mb-4">
                            We received a request to reset your password. Click
                            the button below to reset it.
                        </Text>
                        <Section className="text-center">
                            <Button
                                href={url}
                                className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
                            >
                                Reset Password
                            </Button>
                        </Section>
                        <Text className="mt-4 text-sm text-muted-foreground">
                            If you did not request a password reset, please
                            ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}

export default function PasswordResetMock() {
    return <PasswordResetEmail url="https://example.com/reset-password" />;
}
