package sourcepkg

import core "github.com/hashicorp/mog/internal/e2e/core"

func NodeToCore(s Node) core.ClusterNode {
	var t core.ClusterNode
	t.ID = s.ID
	return t
}
func NewNodeFromCore(t core.ClusterNode) Node {
	var s Node
	s.ID = t.ID
	return s
}
