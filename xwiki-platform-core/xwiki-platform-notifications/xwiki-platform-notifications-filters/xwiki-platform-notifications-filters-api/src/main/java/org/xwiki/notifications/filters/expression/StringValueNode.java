/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
package org.xwiki.notifications.filters.expression;

import org.xwiki.notifications.filters.expression.generics.AbstractValueNode;
import org.xwiki.stability.Unstable;

/**
 * Define value node containing a {@link String}.
 *
 * @version $Id$
 * @since 9.7RC1
 */
@Unstable
public final class StringValueNode extends AbstractValueNode<String>
{
    /**
     * Constructs a new String value node.
     *
     * @param content the content of the node.
     */
    public StringValueNode(String content)
    {
        super(content);
    }

    @Override
    public boolean equals(Object o)
    {
        return (o instanceof StringValueNode && super.equals(o));
    }

    @Override
    public int hashCode()
    {
        return this.getClass().getTypeName().hashCode() * 571 + super.hashCode();
    }
}
