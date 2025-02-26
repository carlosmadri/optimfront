import { AfterViewInit, ChangeDetectionStrategy, Component, inject, QueryList, ViewChildren } from '@angular/core';
import { Location } from '@angular/common';
import { MatTreeModule, MatTreeNode } from '@angular/material/tree';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface RoutesNode {
  name: string;
  url: string;
  children?: RoutesNode[];
  isRoot?: boolean;
}

const TREE_DATA: RoutesNode[] = [
  {
    name: 'Workout',
    url: '/workout',
    children: [
      {
        name: 'Manage Team',
        url: '/workout/manage-team',
      },
      {
        name: 'Manage Job Requisition',
        url: '/workout/manage-job-requisitions',
      },
    ],
  },
  {
    name: 'Worksync',
    url: '/worksync',
    children: [
      {
        name: 'Manage Workload',
        url: '/worksync/manage-workload',
      },
    ],
  },
  {
    name: 'Subcontracting',
    url: '/subcontracting',
    isRoot: true,
  },
];

@Component({
  selector: 'optim-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLinkWithHref, MatTreeModule, MatButtonModule, MatIconModule, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements AfterViewInit {
  @ViewChildren('treeNodes', { read: MatTreeNode }) treeNodes!: QueryList<MatTreeNode<RoutesNode>>;

  dataSource: RoutesNode[] = TREE_DATA;

  childrenAccessor = (node: RoutesNode) => node.children ?? [];

  hasChild = (_: number, node: RoutesNode) => !!node.children && node.children.length > 0;

  location: Location = inject(Location);

  ngAfterViewInit() {
    this.checkInitUrl();
  }

  private checkInitUrl() {
    const currentUrl = this.location.path();
    if (currentUrl && this.treeNodes.length > 0) {
      this.expandNodeByUrl(currentUrl);
    }
  }

  private expandNodeByUrl(url: string) {
    const nodeToExpand = this.findNodeByUrl(this.dataSource, url);
    if (nodeToExpand) {
      this.expandNode(nodeToExpand);
    }
  }

  private findNodeByUrl(nodes: RoutesNode[], targetUrl: string): RoutesNode | undefined {
    return nodes.find((node: RoutesNode) => {
      if (node.url === targetUrl) {
        return true;
      } else {
        const activeChildren = node.children?.find((children) => children.url === targetUrl);
        return activeChildren;
      }
    });
  }

  private expandNode(nodeToExpand: RoutesNode) {
    this.treeNodes.forEach((treeNode: MatTreeNode<RoutesNode>) => {
      if (treeNode.data === nodeToExpand) {
        treeNode.expand();
      }
    });
  }
}
