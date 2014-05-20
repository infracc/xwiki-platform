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
package org.xwiki.lesscss;

import org.xwiki.component.annotation.Role;
import org.xwiki.stability.Unstable;

/**
 * Component to cache already computed LESS files contained in the skin.
 *
 * @since 6.1M1
 * @version $Id$
 */
@Role
@Unstable
public interface LESSSkinFileCache
{
    /**
     * Get a CSS from the name of the LESS source, the wiki ID and the name of the color theme.
     * @param fileName name of the LESS source
     * @param wikiId id of the wiki
     * @param colorTheme name of the color theme
     * @return the corresponding CSS
     */
    String get(String fileName, String wikiId, String colorTheme);

    /**
     * Add a CSS in the cache.
     * @param fileName name of the LESS source
     * @param wikiId id of the wiki
     * @param colorTheme name of the color theme
     * @param output the CSS to cache
     */
    void set(String fileName, String wikiId, String colorTheme, String output);

    /**
     * Clear the cache.
     */
    void clear();

    /**
     * Clear all the cached files related to a wiki and a color theme.
     * @param wikiId id of the wiki
     * @param colorTheme name of the wiki
     */
    void clear(String wikiId, String colorTheme);
}
