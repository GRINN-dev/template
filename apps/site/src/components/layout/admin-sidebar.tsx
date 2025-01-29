"use client";

import * as React from "react";
import {
  AudioWaveform,
  Box,
  BriefcaseBusiness,
  Command,
  GalleryVerticalEnd,
  Images,
  Route,
  Users,
} from "lucide-react";

import { NavGroup } from "@/components/layout/nav-group";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  contents: [
    {
      title: "Modules",
      url: "/admin/content/modules",
      icon: Box,
      items: [
        {
          title: "All",
          url: "/admin/content/modules",
        },
        {
          title: "Podcasts",
          url: "/admin/content/modules/podcasts",
        },
        {
          title: "Videos",
          url: "/admin/content/modules/videos",
        },
        {
          title: "Articles",
          url: "/admin/content/modules/articles",
        },
        {
          title: "Tools",
          url: "/admin/content/modules/tools",
        },
      ],
    },
    {
      title: "Journeys",
      url: "/admin/content/journeys",
      icon: Route,
    },
  ],
  administration: [
    {
      title: "Clients",
      url: "/admin/clients",
      icon: BriefcaseBusiness,
    },
    {
      title: "Membres",
      url: "/admin/members",
      icon: Users,
    },
    {
      title: "Médiathèque",
      url: "/admin/media-library",
      icon: Images,
    },
  ],
};

export interface AdminSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar: Nullish<string>;
  };
}
export function AdminSidebar({ currentUser, ...props }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavGroup items={data.administration} title="Administration" />
        <NavGroup items={data.contents} title="Contents" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
