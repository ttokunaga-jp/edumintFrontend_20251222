// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import { CreatePage } from '@/pages/CreatePage';
import { ServiceHealthProvider } from '@/contexts/ServiceHealthContext'; const meta: Meta<typeof CreatePage> = { title: 'Pages/CreatePage', component: CreatePage, tags: ['autodocs'], decorators: [ (Story) => ( <ServiceHealthProvider> <Story /> </ServiceHealthProvider> ), ], parameters: { layout: 'fullscreen', },
}; export default meta;
type Story = StoryObj<typeof CreatePage>; export const Default: Story = { args: { onNavigate: () => {}, onLogout: () => {}, },
};
